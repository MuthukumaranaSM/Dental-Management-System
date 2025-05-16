import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentDto {
  @ApiProperty({ description: 'Dentist ID', required: false })
  @IsNumber()
  @IsOptional()
  dentistId?: number;

  @ApiProperty({ description: 'Appointment date and time', required: false })
  @IsDate()
  @IsOptional()
  appointmentDate?: Date;

  @ApiProperty({ description: 'Reason for appointment', required: false })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Appointment status', enum: AppointmentStatus, required: false })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
} 
