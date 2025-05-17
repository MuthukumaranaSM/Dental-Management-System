import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { GoogleCalendarModule } from '../google-calendar/google-calendar.module';

@Module({
  imports: [ConfigModule, GoogleCalendarModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
