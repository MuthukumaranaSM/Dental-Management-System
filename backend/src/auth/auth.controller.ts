import { Controller, Post, Body, Get, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { CreateCustomerDto } from './dto/create-customer.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'john.doe@example.com',
          name: 'John Doe',
          role: 'CUSTOMER',
        },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(
      signupDto.email,
      signupDto.password,
      signupDto.name,
      signupDto.role,
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'john.doe@example.com',
          name: 'John Doe',
          role: 'CUSTOMER',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user details',
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getCurrentUser(@Request() req): Promise<UserDto> {
    return this.authService.getUserDetails(req.user.userId);
  }

  @Get('users/dentists')
  @ApiOperation({ summary: 'Get all dentists' })
  @ApiResponse({
    status: 200,
    description: 'Returns all dentists',
    type: [UserDto],
  })
  async getDentists() {
    return this.authService.getDentists();
  }

  @Post('admin/create-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MAIN_DOCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async createUser(@Body() signupDto: SignupDto) {
    return this.authService.createUser(signupDto.email, signupDto.password, signupDto.name, signupDto.role);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MAIN_DOCTOR, Role.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin and Receptionist)' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Receptionist access required' })
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Post('create-customer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.authService.createCustomer(createCustomerDto);
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get detailed user information by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the detailed user information',
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    return this.authService.getUserDetails(parseInt(id, 10));
  }
}
