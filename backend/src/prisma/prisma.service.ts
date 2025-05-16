import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: `mysql://${configService.get('database.username')}:${configService.get('database.password')}@${configService.get('database.host')}:${configService.get('database.port')}/${configService.get('database.database')}`,
        },
      },
      log: configService.get('database.logging') ? ['query', 'info', 'warn', 'error'] : [],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
} 
