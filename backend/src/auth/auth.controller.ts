import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Req,
    Res,
    UnauthorizedException,
    Logger,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { LoginDto, SignupDto, LoginResponseDto, SignupResponseDto, RefreshTokenDto, RefreshTokenResponseDto, LogoutResponseDto } from './dtos/auth.dto';
  import { ApiBody, ApiResponse, ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
  import { Request, Response } from 'express';
  import { Public } from '../common/constants/decorators/public.decorator';
  
  @ApiTags('auth')
  @Controller('auth')
  @ApiBearerAuth()
  export class AuthController {
    private readonly logger = new Logger(AuthController.name);
  
    constructor(private authService: AuthService) {}
  
    @Public()
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: SignupDto })
    @ApiResponse({ status: 201, description: 'User successfully created', type: SignupResponseDto })
    @ApiResponse({ status: 400, description: 'Bad request - email already exists' })
    async signup(@Body() signupDto: SignupDto): Promise<SignupResponseDto> {
      const user = await this.authService.signup(signupDto);
      this.logger.log(`User signed up: ${user.email}`);
      return { message: 'User created successfully', userId: user.id };
    }
  
    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Successfully logged in', type: LoginResponseDto })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(
      @Body() loginDto: LoginDto,
      @Res({ passthrough: true }) response: Response,
    ): Promise<LoginResponseDto> {
      const { accessToken, refreshToken, userId } = await this.authService.login(loginDto);
  
      response.cookie('accessToken', accessToken, {
        maxAge: Number(process.env.BROWSER_COOKIE_ACCESS_EXPIRES_IN) || 3600000,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      });
  
      response.cookie('refreshToken', refreshToken, {
        maxAge: Number(process.env.BROWSER_COOKIE_REFRESH_EXPIRES_IN) || 604800000,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      });
  
      this.logger.log(`User logged in: ${loginDto.email}`);
      return { data: { token: accessToken, refreshToken, userId } };
    }
  
    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token using refresh token' })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({ status: 200, description: 'New tokens generated successfully', type: RefreshTokenResponseDto })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
    async refresh(
      @Req() request: Request,
      @Body() body: RefreshTokenDto,
      @Res({ passthrough: true }) response: Response,
    ): Promise<RefreshTokenResponseDto> {
      try {
        let refreshToken = body.refreshToken;
  
        if (!refreshToken && request.cookies?.refreshToken) {
          refreshToken = request.cookies.refreshToken;
        }
  
        if (!refreshToken && request.headers.authorization) {
          const authHeader = request.headers.authorization;
          if (authHeader.startsWith('Bearer ')) {
            refreshToken = authHeader.substring(7);
          }
        }
  
        if (!refreshToken) {
          throw new UnauthorizedException('No refresh token provided');
        }
  
        const decoded = await this.authService.verifyRefreshToken(refreshToken);
  
        const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshTokens(
          decoded.id,
          decoded.email,
          refreshToken,
        );
  
        response.cookie('accessToken', accessToken, {
          maxAge: Number(process.env.BROWSER_COOKIE_ACCESS_EXPIRES_IN) || 3600000,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
        });
  
        response.cookie('refreshToken', newRefreshToken, {
          maxAge: Number(process.env.BROWSER_COOKIE_REFRESH_EXPIRES_IN) || 604800000,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
        });
  
        return { data: { token: accessToken, refreshToken: newRefreshToken } };
      } catch (e) {
        this.logger.error('Refresh token error:', e);
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
    }
  
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout user and invalidate refresh token' })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({ status: 200, description: 'Successfully logged out', type: LogoutResponseDto })
    @ApiResponse({ status: 400, description: 'Bad request - no refresh token' })
    async logout(
      @Req() request: Request,
      @Body() body: RefreshTokenDto,
      @Res({ passthrough: true }) response: Response,
    ): Promise<LogoutResponseDto> {
      try {
        let refreshToken = body.refreshToken;
  
        if (!refreshToken && request.cookies?.refreshToken) {
          refreshToken = request.cookies.refreshToken;
        }
  
        if (!refreshToken && request.headers.authorization) {
          const authHeader = request.headers.authorization;
          if (authHeader.startsWith('Bearer ')) {
            refreshToken = authHeader.substring(7);
          }
        }
  
        if (!refreshToken) {
          throw new BadRequestException('No refresh token found');
        }
  
        const decoded = await this.authService.verifyRefreshToken(refreshToken);
        await this.authService.logout(decoded.id, refreshToken);
  
        response.clearCookie('accessToken', {
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
        });
  
        response.clearCookie('refreshToken', {
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
        });
  
        this.logger.log('User logged out successfully');
        return { message: 'Logged out successfully' };
      } catch (error) {
        this.logger.error('Logout error:', error);
        response.clearCookie('accessToken', {
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
        });
        response.clearCookie('refreshToken', {
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
        });
        return { message: 'Logged out successfully' };
      }
    }
  }