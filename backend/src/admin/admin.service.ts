import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // First, get the role
    const role = await this.prisma.role.findUnique({
      where: { name: createUserDto.role }
    });

    if (!role) {
      throw new NotFoundException(`Role ${createUserDto.role} not found`);
    }

    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        roleId: role.id
      },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserById(id: string) {
    const userId = parseInt(id, 10);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: CreateUserDto) {
    const userId = parseInt(id, 10);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const data: any = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async deleteUser(id: string) {
    const userId = parseInt(id, 10);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        dentist: true,
        receptionist: true,
        customer: true,
        customerAppointments: true,
        dentistAppointments: true,
        prescriptions: true,
        notifications: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Use a transaction to ensure all deletions succeed or none do
    return await this.prisma.$transaction(async (prisma) => {
      // Delete all associated prescriptions
      await prisma.prescription.deleteMany({
        where: { patientId: userId }
      });

      // Delete all notifications
      await prisma.notification.deleteMany({
        where: { userId }
      });

      // Delete all appointments where user is either customer or dentist
      await prisma.appointment.deleteMany({
        where: {
          OR: [
            { customerId: userId },
            { dentistId: userId }
          ]
        }
      });

      // Delete role-specific records
      if (user.dentist) {
        await prisma.dentist.delete({
          where: { userId }
        });
      }
      if (user.receptionist) {
        await prisma.receptionist.delete({
          where: { userId }
        });
      }
      if (user.customer) {
        await prisma.customer.delete({
          where: { userId }
        });
      }

      // Finally delete the user
      return prisma.user.delete({
        where: { id: userId }
      });
    });
  }
}
