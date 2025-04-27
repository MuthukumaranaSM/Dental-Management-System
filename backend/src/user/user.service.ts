import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../user/dtos/user.dto';
import { hashPassword } from '../common/constants/utill';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const hashedPassword = await hashPassword(createUserDto.password);
  
      // Validate role-specific fields
      if (createUserDto.role === 'DENTIST' && !createUserDto.licenseNumber) {
        throw new BadRequestException('License number is required for dentists');
      }
      if (createUserDto.role === 'PATIENT' && createUserDto.phone) {
        // Optional: Add phone validation logic here
      }
      if (createUserDto.role === 'RECEPTIONIST' && createUserDto.employeeId) {
        // Optional: Add employeeId validation logic here
      }
  
      // Create user and role-specific record in a transaction
      const user = await this.prisma.$transaction(async (prisma) => {
        const newUser = await prisma.user.create({
          data: {
            email: createUserDto.email,
            password: hashedPassword,
            role: createUserDto.role,
          },
        });
  
        if (createUserDto.role === 'ADMIN') {
          await prisma.admin.create({
            data: {
              userId: newUser.id,
              firstName: createUserDto.firstName,
              lastName: createUserDto.lastName,
            },
          });
        } else if (createUserDto.role === 'DENTIST') {
          await prisma.dentist.create({
            data: {
              userId: newUser.id,
              firstName: createUserDto.firstName,
              lastName: createUserDto.lastName,
              licenseNumber: createUserDto.licenseNumber!,
            },
          });
        } else if (createUserDto.role === 'PATIENT') {
          await prisma.patient.create({
            data: {
              userId: newUser.id,
              firstName: createUserDto.firstName,
              lastName: createUserDto.lastName,
              phone: createUserDto.phone,
            },
          });
        } else if (createUserDto.role === 'RECEPTIONIST') {
          await prisma.receptionist.create({
            data: {
              userId: newUser.id,
              firstName: createUserDto.firstName,
              lastName: createUserDto.lastName,
              employeeId: createUserDto.employeeId,
            },
          });
        }
  
        return newUser;
      });
  
      // Get the user response and include the plain password
      const userResponse = await this.getUserResponse(user.id);
      userResponse.password = createUserDto.password; // Include plain password (insecure)
      return userResponse;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Unique constraint violation (e.g., duplicate email)
          throw new BadRequestException('Email or other unique field already exists');
        }
      }
      throw error; // Let other errors propagate (e.g., 500 for unexpected errors)
    }
  }
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      include: {
        admin: true,
        dentist: true,
        patient: true,
        receptionist: true,
      },
    });
    return users.map(user => this.mapToUserResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        admin: true,
        dentist: true,
        patient: true,
        receptionist: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToUserResponseDto(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { admin: true, dentist: true, patient: true, receptionist: true },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Validate role-specific fields
    if (user.role === 'DENTIST' && updateUserDto.licenseNumber === null) {
      throw new BadRequestException('License number cannot be null for dentists');
    }

    // Update user and role-specific record in a transaction
    await this.prisma.$transaction(async (prisma) => {
      if (user.role === 'ADMIN') {
        await prisma.admin.update({
          where: { userId: id },
          data: {
            firstName: updateUserDto.firstName,
            lastName: updateUserDto.lastName,
          },
        });
      } else if (user.role === 'DENTIST') {
        await prisma.dentist.update({
          where: { userId: id },
          data: {
            firstName: updateUserDto.firstName,
            lastName: updateUserDto.lastName,
            licenseNumber: updateUserDto.licenseNumber,
          },
        });
      } else if (user.role === 'PATIENT') {
        await prisma.patient.update({
          where: { userId: id },
          data: {
            firstName: updateUserDto.firstName,
            lastName: updateUserDto.lastName,
            phone: updateUserDto.phone,
          },
        });
      } else if (user.role === 'RECEPTIONIST') {
        await prisma.receptionist.update({
          where: { userId: id },
          data: {
            firstName: updateUserDto.firstName,
            lastName: updateUserDto.lastName,
            employeeId: updateUserDto.employeeId,
          },
        });
      }
    });

    return this.getUserResponse(id);
  }

  async delete(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.prisma.user.delete({ where: { id } }); // Cascades to role-specific table
  }

  private async getUserResponse(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { admin: true, dentist: true, patient: true, receptionist: true },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToUserResponseDto(user);
  }

  private mapToUserResponseDto(user: Prisma.UserGetPayload<{
    include: { admin: true; dentist: true; patient: true; receptionist: true };
  }>): UserResponseDto {
    const roleData = user.admin || user.dentist || user.patient || user.receptionist;
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: roleData?.firstName || null,
      lastName: roleData?.lastName || null,
      licenseNumber: user.dentist?.licenseNumber || null,
      phone: user.patient?.phone || null,
      employeeId: user.receptionist?.employeeId || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      password: null, // Default to null, set explicitly in create method
    };
  }
}