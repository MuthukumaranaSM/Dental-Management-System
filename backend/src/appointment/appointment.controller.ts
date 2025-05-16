import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '@prisma/client';
import { BlockSlotDto } from './dto/block-slot.dto';
import { GenerateBillDto } from './dto/generate-bill.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new appointment (Requires authentication)' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User must be logged in' })
  async create(@Request() req, @Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.MAIN_DOCTOR, RoleType.DENTIST, RoleType.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: 200, description: 'Return all appointments' })
  async findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get appointment by id' })
  @ApiResponse({ status: 200, description: 'Return the appointment' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.MAIN_DOCTOR, RoleType.DENTIST, RoleType.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update appointment' })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() req,
  ) {
    return this.appointmentService.update(+id, updateAppointmentDto, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.MAIN_DOCTOR, RoleType.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete appointment' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }

  @Get('dentist/:dentistId')
  @ApiOperation({ summary: 'Get appointments for a dentist' })
  @ApiResponse({ status: 200, description: 'Return dentist appointments' })
  async getDentistAppointments(@Param('dentistId') dentistId: string) {
    return this.appointmentService.getDentistAppointments(+dentistId);
  }

  @Get('blocked-slots/:dentistId')
  @ApiOperation({ summary: 'Get blocked time slots for a dentist' })
  @ApiResponse({ status: 200, description: 'Return blocked time slots' })
  async getBlockedSlots(
    @Param('dentistId') dentistId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.appointmentService.getBlockedSlots(+dentistId, startDate, endDate);
  }

  @Get('availability/:dentistId')
  @ApiOperation({ summary: 'Get dentist availability including blocked slots and appointments' })
  @ApiResponse({ status: 200, description: 'Return dentist availability' })
  async getAvailability(
    @Param('dentistId') dentistId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.appointmentService.getAvailability(+dentistId, startDate, endDate);
  }

  @Post('block-slot')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.DENTIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Block a time slot' })
  @ApiResponse({ status: 201, description: 'Time slot blocked successfully' })
  async blockTimeSlot(
    @Request() req,
    @Body() blockSlotDto: BlockSlotDto
  ) {
    return this.appointmentService.blockTimeSlot(req.user.userId, blockSlotDto);
  }

  @Delete('block-slot/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.DENTIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unblock a time slot' })
  @ApiResponse({ status: 200, description: 'Time slot unblocked successfully' })
  async unblockTimeSlot(
    @Request() req,
    @Param('id') id: string
  ) {
    return this.appointmentService.unblockTimeSlot(req.user.userId, id);
  }

  @Get('receptionist/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all appointments for receptionist' })
  @ApiResponse({ status: 200, description: 'Return all appointments with details' })
  async getReceptionistAppointments() {
    return this.appointmentService.getReceptionistAppointments();
  }

  @Get('customer/:customerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get appointments for a customer' })
  @ApiResponse({ status: 200, description: 'Return customer appointments' })
  async getCustomerAppointments(@Param('customerId') customerId: string) {
    return this.appointmentService.getCustomerAppointments(+customerId);
  }

  @Post(':id/bill')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate bill for a completed appointment' })
  @ApiResponse({ status: 200, description: 'Bill generated successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  @ApiResponse({ status: 400, description: 'Can only generate bills for completed appointments' })
  async generateBill(
    @Param('id') id: string,
    @Body() billData: GenerateBillDto,
  ) {
    return this.appointmentService.generateBill(id, billData);
  }

  @Get('bills/user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bills for a user' })
  @ApiResponse({ status: 200, description: 'Returns all bills for the user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserBills(@Param('userId') userId: string) {
    return this.appointmentService.getUserBills(parseInt(userId, 10));
  }
}
