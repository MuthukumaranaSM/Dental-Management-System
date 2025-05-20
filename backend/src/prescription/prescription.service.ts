import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class PrescriptionService {
  constructor(private prisma: PrismaService) {}

  async create(createPrescriptionDto: CreatePrescriptionDto) {
    // First check if the appointment exists and belongs to the patient
    const appointment = await this.prisma.appointment.findUnique({
      where: {
        id: createPrescriptionDto.appointmentId,
      },
      include: {
        customer: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.customer.id !== createPrescriptionDto.patientId) {
      throw new BadRequestException('Appointment does not belong to this patient');
    }

    // Only allow prescriptions for COMPLETED appointments
    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Can only add prescriptions to completed appointments');
    }

    return this.prisma.prescription.create({
      data: {
        medication: createPrescriptionDto.medication,
        dosage: createPrescriptionDto.dosage,
        instructions: createPrescriptionDto.instructions,
        patient: {
          connect: {
            id: createPrescriptionDto.patientId,
          },
        },
        appointment: {
          connect: {
            id: createPrescriptionDto.appointmentId,
          },
        },
      },
      include: {
        patient: true,
        appointment: true,
      },
    });
  }

  async findByPatientId(patientId: number) {
    return this.prisma.prescription.findMany({
      where: {
        patientId: patientId,
      },
      include: {
        appointment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async remove(id: number) {
    return this.prisma.prescription.delete({
      where: {
        id: id,
      },
    });
  }
}
