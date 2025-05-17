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

  async signup(email: string, password: string, name: string, role: Role) {
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

    const verificationToken = this.generateVerificationToken();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // Token expires in 24 hours

    console.log('Generated verification token:', verificationToken);
    console.log('Token expires at:', tokenExpires);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: roleRecord.id,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpires: tokenExpires,
      },
      include: {
        role: true,
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
        isEmailVerified: user.isEmailVerified,
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
