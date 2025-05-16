import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateBillDto {
  @ApiProperty({ description: 'Description of the service provided' })
  @IsString()
  serviceDescription: string;

  @ApiProperty({ description: 'Amount charged for the service' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Additional notes about the bill', required: false })
  @IsString()
  @IsOptional()
  additionalNotes?: string;
} 
