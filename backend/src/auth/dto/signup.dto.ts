import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

export class SignupDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password for the user account',
    minLength: 8,
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  name: string;

  @ApiProperty({
    enum: Role,
    example: Role.CUSTOMER,
    description: 'The role of the user',
  })
  role: Role;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Date of birth (required for CUSTOMER)',
    required: false
  })
  dateOfBirth?: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'Address (required for CUSTOMER)',
    required: false
  })
  address?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number (required for CUSTOMER)',
    required: false
  })
  phoneNumber?: string;

  @ApiProperty({
    enum: ['MALE', 'FEMALE', 'OTHER'],
    example: 'MALE',
    description: 'Gender (required for CUSTOMER)',
    required: false
  })
  gender?: string;

  @ApiProperty({
    example: 'General Dentistry',
    description: 'Specialization (required for MAIN_DOCTOR and DENTIST)',
    required: false,
  })
  specialization?: string;

  @ApiProperty({
    example: 'DEN12345',
    description: 'License number (required for MAIN_DOCTOR and DENTIST)',
    required: false,
  })
  licenseNumber?: string;

  @ApiProperty({
    example: 'MORNING',
    description: 'Shift (required for RECEPTIONIST)',
    required: false,
  })
  shift?: string;
}
