import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Dentist ID' })
  @IsNumber()
  dentistId: number;

  @ApiProperty({ description: 'Appointment date and time' })
  @IsDate()
  appointmentDate: Date;

  @ApiProperty({ description: 'Start time' })
  @IsString()
  startTime: string;

  @ApiProperty({ description: 'End time' })
  @IsString()
  endTime: string;

  @ApiProperty({ description: 'Reason for appointment' })
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  notes?: string;
} 
