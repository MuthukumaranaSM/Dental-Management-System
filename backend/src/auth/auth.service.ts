import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { Role } from './enums/role.enum';
import { CreateCustomerDto } from './dto/create-customer.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async signup(
    email: string,
    password: string,
    name: string,
    role: Role,
    specialization?: string,
    licenseNumber?: string,
    dateOfBirth?: string,
    address?: string,
    phoneNumber?: string,
    gender?: string
  ) {
    console.log('Starting signup process for:', email);
    
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists:', email);
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the role ID from the roles table
    const roleRecord = await this.prisma.role.findUnique({
      where: { name: role },
    });

    if (!roleRecord) {
      console.log('Invalid role specified:', role);
      throw new ConflictException('Invalid role specified');
    }

    // Validate required fields for MAIN_DOCTOR
    if (role === Role.MAIN_DOCTOR) {
      if (!specialization || !licenseNumber) {
        throw new BadRequestException('Main Doctor requires specialization and license number');
      }
    }

    const verificationToken = this.generateVerificationToken();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // Token expires in 24 hours

    const userData = {
      email,
      password: hashedPassword,
      name,
      roleId: roleRecord.id,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: tokenExpires,
    };

    // Add role-specific data
    let roleSpecificData = {};
    if (role === Role.MAIN_DOCTOR) {
      roleSpecificData = {
        mainDoctor: {
          create: {
            specialization,
            licenseNumber,
          },
        },
      };    } else if (role === Role.CUSTOMER) {
      roleSpecificData = {
        customer: {
          create: {
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            address: address || '',
            phoneNumber: phoneNumber || '',
            gender: gender || 'OTHER'
          }
        }
      };
    }

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        ...roleSpecificData,
      },
      include: {
        role: true,
        mainDoctor: true,
        customer: true,
      },
    });

    console.log('User created with ID:', user.id);
    console.log('Stored verification token:', user.emailVerificationToken);

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(email, verificationToken);
      console.log('Verification email sent successfully to:', email);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't throw here, as the user is already created
    }

    const token = this.jwtService.sign({ userId: user.id, role: user.role.name });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
        isEmailVerified: user.isEmailVerified,
        specialization: user.mainDoctor?.specialization,
        licenseNumber: user.mainDoctor?.licenseNumber,
      },
    };
  }

  async verifyEmail(token: string) {
    console.log('Attempting to verify email with token:', token);
    
    if (!token) {
      console.log('No token provided');
      throw new BadRequestException('Verification token is required');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationTokenExpires: {
          gt: new Date(),
        },
      },
    });

    console.log('Found user with token:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User details:', {
        id: user.id,
        email: user.email,
        isVerified: user.isEmailVerified,
        tokenExpires: user.emailVerificationTokenExpires
      });
    }

    if (!user) {
      // Check if the token exists but is expired
      const expiredUser = await this.prisma.user.findFirst({
        where: {
          emailVerificationToken: token,
        },
      });

      if (expiredUser) {
        console.log('Found expired token for user:', expiredUser.email);
        throw new BadRequestException('Verification token has expired. Please request a new verification email.');
      }

      console.log('No user found with this token');
      throw new BadRequestException('Invalid verification token');
    }

    // If user is already verified, return success
    if (user.isEmailVerified) {
      console.log('User already verified:', user.email);
      return { message: 'Email already verified' };
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpires: null,
      },
    });

    console.log('Successfully verified email for user:', user.email);
    return { message: 'Email verified successfully' };
  }

  async login(email: string, password: string) {    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        customer: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.id, role: user.role.name });    const customerData = user.customer ? {
      id: user.customer.id,
      userId: user.customer.userId,
      dateOfBirth: user.customer.dateOfBirth || new Date(),
      phoneNumber: user.customer.phoneNumber || '',
      address: user.customer.address || '',
      gender: user.customer.gender || 'OTHER'
    } : undefined;

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
        isEmailVerified: user.isEmailVerified,
        customer: customerData,
      },
    };
  }
  async getUserDetails(userId: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        customer: true,
        dentist: true,
        receptionist: true,
        mainDoctor: true
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
      specialization: user.dentist?.specialization || user.mainDoctor?.specialization,
      licenseNumber: user.dentist?.licenseNumber || user.mainDoctor?.licenseNumber,
      shift: user.receptionist?.shift,
      customer: user.customer ? {
        id: user.customer.id,
        userId: user.customer.userId,
        phoneNumber: user.customer.phoneNumber || '',
        dateOfBirth: user.customer.dateOfBirth,
        address: user.customer.address,
        gender: user.customer.gender
      } : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
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
    const verificationToken = this.generateVerificationToken();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // Token expires in 24 hours

    const userData = {
      email,
      password: hashedPassword,
      name,
      roleId: roleEntity.id,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: tokenExpires,
    };

    // Add role-specific data
    let roleSpecificData = {};
    if (role === Role.DENTIST) {
      if (!specialization || !licenseNumber) {
        throw new BadRequestException('Dentist requires specialization and license number');
      }
      roleSpecificData = {
        dentist: {
          create: {
            specialization,
            licenseNumber,
          },
        },
      };
    } else if (role === Role.RECEPTIONIST) {
      if (!shift) {
        throw new BadRequestException('Receptionist requires shift information');
      }
      roleSpecificData = {
        receptionist: {
          create: {
            shift,
          },
        },
      };
    } else if (role === Role.MAIN_DOCTOR) {
      if (!specialization || !licenseNumber) {
        throw new BadRequestException('Main Doctor requires specialization and license number');
      }
      roleSpecificData = {
        mainDoctor: {
          create: {
            specialization,
            licenseNumber,
          },
        },
      };
    } else if (role === Role.CUSTOMER) {
      roleSpecificData = {
        customer: {
          create: {} // Create empty customer record that can be updated later
        }
      };
    }

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        ...roleSpecificData,
      },
      include: {
        role: true,
        customer: true,
        dentist: true,
        receptionist: true,
        mainDoctor: true,
      },
    });

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(email, verificationToken);
      console.log('Verification email sent successfully to:', email);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't throw here, as the user is already created
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name as Role,
      specialization: user.dentist?.specialization || user.mainDoctor?.specialization,
      licenseNumber: user.dentist?.licenseNumber || user.mainDoctor?.licenseNumber,
      shift: user.receptionist?.shift,
    };
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      include: {
        role: true,
        dentist: true,
        receptionist: true,
        customer: true
      }
    });

    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name as Role,
      specialization: user.dentist?.specialization,
      licenseNumber: user.dentist?.licenseNumber,
      shift: user.receptionist?.shift,
      customer: user.customer ? {
        id: user.customer.id,
        userId: user.customer.userId,
        phoneNumber: user.customer.phoneNumber || '',
        dateOfBirth: user.customer.dateOfBirth,
        address: user.customer.address,
        gender: user.customer.gender
      } : undefined
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

    // Generate verification token
    const verificationToken = this.generateVerificationToken();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // Token expires in 24 hours

    // Create customer
    const customer = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: customerRole.id,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpires: tokenExpires,
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

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(email, verificationToken);
      console.log('Verification email sent successfully to:', email);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't throw here, as the user is already created
    }

    // Remove password from response
    const { password: _, ...result } = customer;
    return result;
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal that the email doesn't exist
      return { message: 'If your email is registered, you will receive a password reset link' };
    }

    const resetToken = this.generateVerificationToken();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 1); // Token expires in 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpires: tokenExpires,
      },
    });

    // Send password reset email
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'If your email is registered, you will receive a password reset link' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpires: null,
      },
    });

    return { message: 'Password has been reset successfully' };
  }
}
