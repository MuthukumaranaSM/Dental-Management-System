import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Role } from '../auth/enums/role.enum';
import { AppointmentStatus } from '@prisma/client';
import { BlockSlotDto } from './dto/block-slot.dto';
import * as bcrypt from 'bcrypt';
import { GenerateBillDto } from './dto/generate-bill.dto';
import { NotificationService } from '../notification/notification.service';
import { EmailService } from '../email/email.service';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';

type AllowedRole = Extract<Role, Role.MAIN_DOCTOR | Role.DENTIST | Role.RECEPTIONIST>;

@Injectable()
export class AppointmentService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private emailService: EmailService,
    private googleCalendarService: GoogleCalendarService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: number) {
    // Verify that the dentist exists and is a dentist
    const dentist = await this.prisma.user.findUnique({
      where: { 
        id: createAppointmentDto.dentistId 
      },
      include: { role: true }
    });

    if (!dentist) {
      throw new NotFoundException('Dentist not found');
    }

    if (dentist.role.name !== Role.DENTIST) {
      throw new BadRequestException('Selected user is not a dentist');
    }

    // Get or create customer from authenticated user
    const customer = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Check if the time slot is available
    const appointmentDate = new Date(createAppointmentDto.appointmentDate);
    if (isNaN(appointmentDate.getTime())) {
      throw new BadRequestException('Invalid appointment date');
    }

    const isSlotAvailable = await this.isSlotAvailable(
      appointmentDate.toISOString(),
      createAppointmentDto.startTime,
      createAppointmentDto.endTime,
      createAppointmentDto.dentistId
    );

    if (!isSlotAvailable) {
      throw new BadRequestException('Selected time slot is not available');
    }

    // Create the appointment
    const appointment = await this.prisma.appointment.create({
      data: {
        customerId: customer.id,
        dentistId: createAppointmentDto.dentistId,
        appointmentDate: appointmentDate,
        reason: createAppointmentDto.reason,
        notes: createAppointmentDto.notes,
        status: AppointmentStatus.PENDING,
      },
      include: {
        customer: true,
        dentist: true,
      },
    });

    try {
      // Parse the appointment date and time
      const appointmentDateTime = new Date(appointmentDate);
      if (isNaN(appointmentDateTime.getTime())) {
        throw new Error('Invalid appointment date');
      }

      // Parse start time
      const startTimeParts = createAppointmentDto.startTime.split(':');
      if (startTimeParts.length < 2) {
        throw new Error('Invalid start time format. Expected HH:mm');
      }

      const startHours = parseInt(startTimeParts[0], 10);
      const startMinutes = parseInt(startTimeParts[1], 10);

      if (isNaN(startHours) || isNaN(startMinutes) || 
          startHours < 0 || startHours > 23 || 
          startMinutes < 0 || startMinutes > 59) {
        throw new Error('Invalid start time values');
      }

      // Parse end time
      const endTimeParts = createAppointmentDto.endTime.split(':');
      if (endTimeParts.length < 2) {
        throw new Error('Invalid end time format. Expected HH:mm');
      }

      const endHours = parseInt(endTimeParts[0], 10);
      const endMinutes = parseInt(endTimeParts[1], 10);

      if (isNaN(endHours) || isNaN(endMinutes) || 
          endHours < 0 || endHours > 23 || 
          endMinutes < 0 || endMinutes > 59) {
        throw new Error('Invalid end time values');
      }

      // Create start and end date objects
      const startDateTime = new Date(appointmentDateTime);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date(appointmentDateTime);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      // Validate that end time is after start time
      if (endDateTime <= startDateTime) {
        throw new Error('End time must be after start time');
      }

      // Send email notification with calendar link
      await this.emailService.sendAppointmentConfirmation(
        customer.email,
        {
          date: appointmentDateTime,
          startTime: createAppointmentDto.startTime,
          endTime: createAppointmentDto.endTime,
          dentistName: dentist.name,
          reason: createAppointmentDto.reason,
          status: AppointmentStatus.PENDING,
        }
      );
    } catch (error) {
      console.error('Error in appointment creation:', error);
      // Don't throw error here as we don't want to fail the appointment creation
    }

    return appointment;
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      include: {
        customer: true,
        dentist: true,
      },
    });
  }

  async findOne(id: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        customer: true,
        dentist: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto, userRole: string) {
    const appointment = await this.findOne(id);

    // Check if user has permission to update status
    if (updateAppointmentDto.status && updateAppointmentDto.status !== appointment.status) {
      const allowedRoles = [Role.MAIN_DOCTOR, Role.DENTIST, Role.RECEPTIONIST];
      if (!allowedRoles.includes(userRole as Role)) {
        throw new UnauthorizedException('You do not have permission to update appointment status');
      }

      // Additional validation for status transitions
      if (appointment.status === 'COMPLETED' && updateAppointmentDto.status !== 'COMPLETED') {
        throw new BadRequestException('Cannot change status of a completed appointment');
      }

      if (appointment.status === 'CANCELLED' && updateAppointmentDto.status !== 'CANCELLED') {
        throw new BadRequestException('Cannot change status of a cancelled appointment');
      }

      // Create notification for status change
      if (updateAppointmentDto.status === AppointmentStatus.CONFIRMED || 
          updateAppointmentDto.status === AppointmentStatus.CANCELLED) {
        await this.notificationService.createAppointmentNotification(
          appointment.customerId,
          appointment.id,
          updateAppointmentDto.status,
        );
      }
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
      include: {
        customer: true,
        dentist: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.appointment.delete({
      where: { id },
    });
  }

  async getDentistAppointments(dentistId: number) {
    return this.prisma.appointment.findMany({
      where: { dentistId },
      include: {
        customer: true,
      },
    });
  }

  async getAllAppointments() {
    return this.prisma.appointment.findMany();
  }

  async getAppointmentById(id: string) {
    const appointmentId = parseInt(id, 10);
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async cancelAppointment(id: string) {
    const appointmentId = parseInt(id, 10);
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return this.prisma.appointment.delete({
      where: { id: appointmentId },
    });
  }

  async blockTimeSlot(dentistId: number, blockSlotDto: BlockSlotDto) {
    if (!dentistId) {
      throw new BadRequestException('Dentist ID is required');
    }

    // First check if the dentist exists and is actually a dentist
    const dentist = await this.prisma.user.findUnique({
      where: { 
        id: dentistId 
      },
      include: { role: true }
    });

    if (!dentist) {
      throw new NotFoundException('Dentist not found');
    }

    if (dentist.role.name !== Role.DENTIST) {
      throw new UnauthorizedException('Only dentists can block time slots');
    }

    // Check if there are any existing appointments for this time slot
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        dentistId,
        appointmentDate: new Date(blockSlotDto.date),
        status: { not: AppointmentStatus.CANCELLED }
      }
    });

    if (existingAppointment) {
      throw new BadRequestException('Cannot block time slot with existing appointments');
    }

    // Create the blocked slot
    return this.prisma.blockedSlot.create({
      data: {
        date: new Date(blockSlotDto.date),
        startTime: blockSlotDto.startTime,
        endTime: blockSlotDto.endTime,
        reason: blockSlotDto.reason,
        dentist: {
          connect: { id: dentistId }
        }
      }
    });
  }

  async unblockTimeSlot(dentistId: number, slotId: string) {
    const blockedSlot = await this.prisma.blockedSlot.findUnique({
      where: { id: slotId }
    });

    if (!blockedSlot) {
      throw new NotFoundException('Blocked slot not found');
    }

    if (blockedSlot.dentistId !== dentistId) {
      throw new UnauthorizedException('You can only unblock your own time slots');
    }

    return this.prisma.blockedSlot.delete({
      where: { id: slotId }
    });
  }

  async getBlockedSlots(dentistId: number, startDate?: string, endDate?: string) {
    const where = {
      dentistId,
      ...(startDate && endDate ? {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      } : {})
    };

    return this.prisma.blockedSlot.findMany({
      where,
      orderBy: {
        date: 'asc'
      }
    });
  }

  async getAvailability(dentistId: number, startDate?: string, endDate?: string) {
    // Get blocked slots
    const blockedSlots = await this.getBlockedSlots(dentistId, startDate, endDate);

    // Get appointments
    const appointments = await this.prisma.appointment.findMany({
      where: {
        dentistId,
        status: { not: AppointmentStatus.CANCELLED },
        ...(startDate && endDate ? {
          appointmentDate: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        } : {})
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    });

    return {
      blockedSlots,
      appointments
    };
  }

  async unblockSlot(id: string) {
    const blockedSlot = await this.prisma.blockedSlot.findUnique({
      where: { id },
    });

    if (!blockedSlot) {
      throw new NotFoundException(`Blocked slot with ID ${id} not found`);
    }

    return this.prisma.blockedSlot.delete({
      where: { id },
    });
  }

  async getReceptionistAppointments() {
    const appointments = await this.prisma.appointment.findMany({
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          }
        },
        dentist: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        appointmentDate: 'desc'
      }
    });
    console.log('Receptionist appointments:', appointments);
    return appointments;
  }

  async getCustomerAppointments(customerId: number) {
    return this.prisma.appointment.findMany({
      where: { customerId },
      include: {
        dentist: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        appointmentDate: 'desc'
      }
    });
  }

  async generateBill(appointmentId: string, billData: GenerateBillDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) },
      include: {
        customer: true,
        dentist: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== 'COMPLETED') {
      throw new BadRequestException('Can only generate bills for completed appointments');
    }

    // Check if a bill already exists for this appointment
    const existingBill = await this.prisma.bill.findUnique({
      where: { appointmentId: parseInt(appointmentId) },
    });

    let bill;
    if (existingBill) {
      // Update existing bill
      bill = await this.prisma.bill.update({
        where: { appointmentId: parseInt(appointmentId) },
        data: {
          amount: billData.amount,
          serviceDescription: billData.serviceDescription,
          additionalNotes: billData.additionalNotes,
          status: 'PAID',
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new bill
      bill = await this.prisma.bill.create({
        data: {
          appointmentId: parseInt(appointmentId),
          amount: billData.amount,
          serviceDescription: billData.serviceDescription,
          additionalNotes: billData.additionalNotes,
          status: 'PAID',
          createdAt: new Date(),
        },
      });
    }

    return bill;
  }

  async getUserBills(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const bills = await this.prisma.bill.findMany({
      where: {
        appointment: {
          customerId: userId,
        },
      },
      include: {
        appointment: {
          include: {
            dentist: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return bills;
  }

  private async isSlotBlocked(date: Date, startTime: string, endTime: string) {
    const blockedSlot = await this.prisma.blockedSlot.findFirst({
      where: {
        date: {
          equals: new Date(date.setHours(0, 0, 0, 0))
        },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gte: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lte: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
    });

    return !!blockedSlot;
  }

  private async isSlotAvailable(date: string, startTime: string, endTime: string, dentistId: number) {
    // Check if the time slot is blocked
    const isBlocked = await this.isSlotBlocked(new Date(date), startTime, endTime);

    if (isBlocked) {
      return false;
    }

    // Check if there are any existing appointments for this time slot
    const appointmentDate = new Date(date);
    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');
    
    const startDateTime = new Date(appointmentDate);
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
    
    const endDateTime = new Date(appointmentDate);
    endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

    // Only check for CONFIRMED appointments
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        dentistId,
        appointmentDate: {
          gte: startDateTime,
          lt: endDateTime
        },
        status: AppointmentStatus.CONFIRMED // Only check for CONFIRMED appointments
      }
    });

    // If there's no CONFIRMED appointment, the slot is available
    return !existingAppointment;
  }
}
