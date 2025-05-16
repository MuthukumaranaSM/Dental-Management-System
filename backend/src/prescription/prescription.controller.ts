import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@ApiTags('prescriptions')
@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new prescription' })
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionService.create(createPrescriptionDto);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all prescriptions for a patient' })
  findByPatientId(@Param('patientId') patientId: string) {
    return this.prescriptionService.findByPatientId(+patientId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a prescription' })
  remove(@Param('id') id: string) {
    return this.prescriptionService.remove(+id);
  }
} 
