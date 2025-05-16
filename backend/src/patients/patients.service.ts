import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async getPatientDetails(patientId: number) {
    // First try to find by customer ID
    let patient = await this.prisma.customer.findUnique({
      where: {
        id: patientId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // If not found, try to find by user ID
    if (!patient) {
      const customerByUserId = await this.prisma.customer.findFirst({
        where: {
          userId: patientId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      patient = customerByUserId;
    }

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    // Get patient's appointments
    const appointments = await this.prisma.appointment.findMany({
      where: {
        customerId: patient.user.id,
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    });

    // Get patient's prescriptions
    const prescriptions = await this.prisma.prescription.findMany({
      where: {
        patientId: patient.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      id: patient.id,
      name: patient.user.name,
      email: patient.user.email,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      phoneNumber: patient.phoneNumber,
      address: patient.address,
      allergies: patient.allergies ? patient.allergies.split(',') : [],
      medicalHistory: patient.medicalHistory,
      appointments: appointments.map(appointment => ({
        id: appointment.id,
        appointmentDate: appointment.appointmentDate,
        status: appointment.status,
        reason: appointment.reason,
        notes: appointment.notes,
      })),
      prescriptions: prescriptions.map(prescription => ({
        id: prescription.id,
        medication: prescription.medication,
        dosage: prescription.dosage,
        instructions: prescription.instructions,
        createdAt: prescription.createdAt,
      })),
    };
  }
}
