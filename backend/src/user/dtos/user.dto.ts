import { IsString, IsEmail, IsOptional, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/types';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'The password for the user account (minimum 6 characters)',
    example: 'securePassword123',
  })
  password: string;

  @IsEnum(Role)
  @ApiProperty({
    description: 'The role of the user',
    enum: Role,
    example: Role.RECEPTIONIST,
  })
  role: Role;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The first name of the user (optional)',
    example: 'John',
    required: false,
    nullable: true,
  })
  firstName?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The last name of the user (optional)',
    example: 'Doe',
    required: false,
    nullable: true,
  })
  lastName?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The license number for dentists (required for DENTIST role)',
    example: 'D123456',
    required: false,
    nullable: true,
  })
  licenseNumber?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The phone number for patients (optional for PATIENT role)',
    example: '+1234567890',
    required: false,
    nullable: true,
  })
  phone?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The employee ID for receptionists (optional for RECEPTIONIST role)',
    example: 'R789',
    required: false,
    nullable: true,
  })
  employeeId?: string | null;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The first name of the user (optional)',
    example: 'John',
    required: false,
    nullable: true,
  })
  firstName?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The last name of the user (optional)',
    example: 'Doe',
    required: false,
    nullable: true,
  })
  lastName?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The license number for dentists (optional for DENTIST role)',
    example: 'D123456',
    required: false,
    nullable: true,
  })
  licenseNumber?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The phone number for patients (optional for PATIENT role)',
    example: '+1234567890',
    required: false,
    nullable: true,
  })
  phone?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The employee ID for receptionists (optional for RECEPTIONIST role)',
    example: 'R789',
    required: false,
    nullable: true,
  })
  employeeId?: string | null;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: Role,
    example: Role.RECEPTIONIST,
  })
  role: Role;

  @ApiProperty({
    description: 'The first name of the user (optional)',
    example: 'John',
    required: false,
    nullable: true,
  })
  firstName: string | null;

  @ApiProperty({
    description: 'The last name of the user (optional)',
    example: 'Doe',
    required: false,
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    description: 'The license number for dentists (present for DENTIST role)',
    example: 'D123456',
    required: false,
    nullable: true,
  })
  licenseNumber: string | null;

  @ApiProperty({
    description: 'The phone number for patients (present for PATIENT role)',
    example: '+1234567890',
    required: false,
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    description: 'The employee ID for receptionists (present for RECEPTIONIST role)',
    example: 'R789',
    required: false,
    nullable: true,
  })
  employeeId: string | null;

  @ApiProperty({
    description: 'The date when the user was created',
    example: '2025-04-26T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the user was last updated',
    example: '2025-04-26T10:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The plain password of the user (included only on creation, for specific use cases)',
    example: 'securePassword123',
    required: false,
    nullable: true,
  })
  password?: string | null; // Add optional password field
}
export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'The password for the user account',
    example: 'securePassword123',
  })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'The JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The user details',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}