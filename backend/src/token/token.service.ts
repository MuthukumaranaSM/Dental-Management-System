import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as moment from 'moment';
import { Token } from '@prisma/client';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(private prisma: PrismaService) {}

  async createToken(userId: string, token: string): Promise<Token> {
    try {
      return await this.prisma.token.create({
        data: {
          token,
          userId,
          expiredAt: moment().add(7, 'days').toDate(),
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create token for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async deleteToken(userId: string, refreshToken: string): Promise<void> {
    try {
      const result = await this.prisma.token.deleteMany({
        where: { userId, token: refreshToken },
      });
      if (result.count === 0) {
        this.logger.warn(`No token found to delete for user ${userId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete token for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async findOne(userId: string, token: string): Promise<Token | null> {
    try {
      return await this.prisma.token.findFirst({
        where: { userId, token, expiredAt: { gte: moment().toDate() } },
      });
    } catch (error) {
      this.logger.error(`Failed to find token for user ${userId}: ${error.message}`);
      throw error;
    }
  }
}