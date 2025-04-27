import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { LoginDto, SignupDto } from './dtos/auth.dto';
import { isPasswordValid, hashPassword } from '../common/constants/utill';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.userService.findOneByEmail(signupDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    return this.userService.create(signupDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (!user || !(await isPasswordValid(loginDto.password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }

    const accessToken = await this.createAccessToken(user.id, user.email);
    const refreshToken = await this.createRefreshToken(user.id, user.email);
    await this.tokenService.createToken(user.id, refreshToken);

    return { accessToken, refreshToken, userId: user.id };
  }
// In auth.service.ts
async verifyRefreshToken(token: string) {
  return this.jwtService.verifyAsync(token);
}

  async createAccessToken(id: string, email: string) {
    return this.jwtService.signAsync(
      { id, email, isAccess: true },
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
  }

  async createRefreshToken(id: string, email: string) {
    return this.jwtService.signAsync(
      { id, email, isAccess: false },
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN },
    );
  }

  async refreshTokens(userId: string, email: string, oldRefreshToken: string) {
    const tokenExists = await this.tokenService.findOne(userId, oldRefreshToken);
    if (!tokenExists) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.jwtService.verifyAsync(oldRefreshToken);
    await this.tokenService.deleteToken(userId, oldRefreshToken);

    const accessToken = await this.createAccessToken(userId, email);
    const refreshToken = await this.createRefreshToken(userId, email);
    await this.tokenService.createToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(userId: string, refreshToken: string) {
    await this.tokenService.deleteToken(userId, refreshToken);
  }
}