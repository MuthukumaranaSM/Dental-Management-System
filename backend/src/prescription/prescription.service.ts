import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class PrescriptionService {
  constructor(private prisma: PrismaService) {}

  async create(createPrescriptionDto: CreatePrescriptionDto) {
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
      },
    });
  }

  async findByPatientId(patientId: number) {
    return this.prisma.prescription.findMany({
      where: {
        patientId: patientId,
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
