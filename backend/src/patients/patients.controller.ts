import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('patients')
@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get patient details by ID' })
  @ApiResponse({ status: 200, description: 'Returns patient details' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getPatientDetails(@Param('id') id: string) {
    return this.patientsService.getPatientDetails(Number(id));
  }
}
