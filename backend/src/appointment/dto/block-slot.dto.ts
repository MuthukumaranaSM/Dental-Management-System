import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsOptional } from 'class-validator';

export class BlockSlotDto {
  @ApiProperty({ description: 'Date of the blocked slot' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Start time of the blocked slot' })
  @IsString()
  startTime: string;

  @ApiProperty({ description: 'End time of the blocked slot' })
  @IsString()
  endTime: string;

  @ApiProperty({ description: 'Reason for blocking the slot', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
