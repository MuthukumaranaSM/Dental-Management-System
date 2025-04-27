import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}