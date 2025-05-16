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
} 
