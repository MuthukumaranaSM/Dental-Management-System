import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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