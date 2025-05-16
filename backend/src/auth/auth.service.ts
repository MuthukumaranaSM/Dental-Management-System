import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { Role } from './enums/role.enum';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string, name: string, role: Role) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the role ID from the roles table
    const roleRecord = await this.prisma.role.findUnique({
      where: { name: role },
    });

    if (!roleRecord) {
      throw new ConflictException('Invalid role specified');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: roleRecord.id,
      },
      include: {
        role: true,
      },
    });

    const token = this.jwtService.sign({ userId: user.id, role: user.role.name });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.id, role: user.role.name });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
    };
  }

  async getUserDetails(userId: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name as Role,
    };
  }

  async getDentists(): Promise<UserDto[]> {
    const dentistRole = await this.prisma.role.findUnique({
      where: { name: Role.DENTIST }
    });

    if (!dentistRole) {
      return [];
    }

    const dentists = await this.prisma.user.findMany({
      where: { roleId: dentistRole.id },
      include: { role: true }
    });

    return dentists.map(dentist => ({
      id: dentist.id,
      email: dentist.email,
      name: dentist.name,
      role: dentist.role.name as Role
    }));
  }

  async createUser(
    email: string,
    password: string,
    name: string,
    role: Role,
    specialization?: string,
    licenseNumber?: string,
    shift?: string,
  ): Promise<UserDto> {
    const roleEntity = await this.prisma.role.findUnique({
      where: { name: role }
    });

    if (!roleEntity) {
      throw new BadRequestException('Invalid role');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashedPassword,
      name,
      roleId: roleEntity.id,
    };

    // Add role-specific data
    let roleSpecificData = {};
    if (role === Role.DENTIST && specialization && licenseNumber) {
      roleSpecificData = {
        dentist: {
          create: {
            specialization,
            licenseNumber,
          },
        },
      };
    } else if (role === Role.RECEPTIONIST && shift) {
      roleSpecificData = {
        receptionist: {
          create: {
            shift,
          },
        },
      };
    }

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        ...roleSpecificData,
      },
      include: {
        role: true,
        dentist: true,
        receptionist: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name as Role,
      specialization: user.dentist?.specialization,
      licenseNumber: user.dentist?.licenseNumber,
      shift: user.receptionist?.shift,
    };
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      include: {
        role: true,
        dentist: true,
        receptionist: true
      }
    });

    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name as Role,
      specialization: user.dentist?.specialization,
      licenseNumber: user.dentist?.licenseNumber,
      shift: user.receptionist?.shift
    }));
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    const { email, password, name, dateOfBirth, address, phoneNumber } = createCustomerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Get customer role
    const customerRole = await this.prisma.role.findUnique({
      where: { name: Role.CUSTOMER },
    });

    if (!customerRole) {
      throw new BadRequestException('Customer role not found');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    const customer = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: customerRole.id,
        customer: {
          create: {
            dateOfBirth: new Date(dateOfBirth),
            address,
            phoneNumber,
          },
        },
      },
      include: {
        customer: true,
        role: true,
      },
    });

    // Remove password from response
    const { password: _, ...result } = customer;
    return result;
  }
}
