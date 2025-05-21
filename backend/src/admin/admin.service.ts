import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../auth/enums/role.enum';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // First, get the role
    const role = await this.prisma.role.findUnique({
      where: { name: createUserDto.role }
    });

    if (!role) {
      throw new NotFoundException(`Role ${createUserDto.role} not found`);
    }

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // Token expires in 24 hours

    // Add role-specific data
    let roleSpecificData = {};
    if (createUserDto.role === Role.DENTIST) {
      if (!createUserDto.specialization || !createUserDto.licenseNumber) {
        throw new BadRequestException('Dentist requires specialization and license number');
      }
      roleSpecificData = {
        dentist: {
          create: {
            specialization: createUserDto.specialization,
            licenseNumber: createUserDto.licenseNumber,
          },
        },
      };
    } else if (createUserDto.role === Role.MAIN_DOCTOR) {
      if (!createUserDto.specialization || !createUserDto.licenseNumber) {
        throw new BadRequestException('Main Doctor requires specialization and license number');
      }
      roleSpecificData = {
        mainDoctor: {
          create: {
            specialization: createUserDto.specialization,
            licenseNumber: createUserDto.licenseNumber,
          },
        },
      };
    } else if (createUserDto.role === Role.RECEPTIONIST) {
      if (!createUserDto.shift) {
        throw new BadRequestException('Receptionist requires shift information');
      }
      roleSpecificData = {
        receptionist: {
          create: {
            shift: createUserDto.shift,
          },
        },
      };
    } else if (createUserDto.role === Role.CUSTOMER) {
      roleSpecificData = {
        customer: {
          create: {},
        },
      };
    }

    // Create user with role-specific data
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        roleId: role.id,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpires: tokenExpires,
        ...roleSpecificData,
      },
      include: {
        role: true,
        mainDoctor: true,
        dentist: true,
        receptionist: true,
        customer: true,
      },
    });

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(createUserDto.email, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't throw here, as user is already created
    }

    return user;
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
    const user = await this.prisma.user.findUnique({      where: { id: userId },
      include: {
        mainDoctor: true,
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

      // Get all appointments where user is either customer or dentist
      const appointments = await prisma.appointment.findMany({
        where: {
          OR: [
            { customerId: userId },
            { dentistId: userId }
          ]
        },
        select: {
          id: true
        }
      });

      const appointmentIds = appointments.map(app => app.id);

      // Delete appointment symptoms
      await prisma.appointmentSymptom.deleteMany({
        where: {
          appointmentId: {
            in: appointmentIds
          }
        }
      });

      // Delete bills
      await prisma.bill.deleteMany({
        where: {
          appointmentId: {
            in: appointmentIds
          }
        }
      });

      // Delete appointment notifications
      await prisma.notification.deleteMany({
        where: {
          appointmentId: {
            in: appointmentIds
          }
        }
      });

      // Now delete the appointments
      await prisma.appointment.deleteMany({
        where: {
          OR: [
            { customerId: userId },
            { dentistId: userId }
          ]
        }
      });      // Delete blocked slots for dentists
      await prisma.blockedSlot.deleteMany({
        where: { dentistId: userId }
      });

      // Delete role-specific records
      if (user.mainDoctor) {
        await prisma.mainDoctor.delete({
          where: { userId }
        });
      }
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
