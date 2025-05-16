import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreatePrescriptionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  medication: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  instructions: string;
} 
