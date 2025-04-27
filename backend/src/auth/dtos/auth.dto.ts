import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from '../../common/types';

export class SignupDto {
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'User email',
    example: 'test@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @ApiProperty({
    type: String,
    description: 'User password',
    example: '123456',
  })
  password: string;

  @IsEnum(Role)
  @ApiProperty({
    enum: Role,
    description: 'User role',
    example: Role.PATIENT,
  })
  role: Role;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'First name',
    example: 'John',
  })
  firstName: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'Last name',
    example: 'Doe',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'License number (required for DENTIST role)',
    example: 'D123456',
    required: false,
  })
  licenseNumber?: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'Phone number (optional for PATIENT role)',
    example: '+1234567890',
    required: false,
  })
  phone?: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'Employee ID (optional for RECEPTIONIST role)',
    example: 'R789',
    required: false,
  })
  employeeId?: string;
}

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'User email',
    example: 'test@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @ApiProperty({
    type: String,
    description: 'User password',
    example: '123456',
  })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    type: Object,
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      userId: '123e4567-e89b-12d3-a456-426614174000'
    }
  })
  data: {
    token: string;
    refreshToken: string;
    userId: string;
  };
}

export class SignupResponseDto {
  @ApiProperty({
    example: 'User created successfully'
  })
  message: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  userId: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    type: String,
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken?: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty({
    type: Object,
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
  })
  data: {
    token: string;
    refreshToken: string;
  };
}

export class LogoutResponseDto {
  @ApiProperty({
    example: 'Logged out successfully'
  })
  message: string;
}