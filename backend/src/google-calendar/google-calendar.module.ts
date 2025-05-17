import { Module } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [GoogleCalendarService],
  exports: [GoogleCalendarService],
})
export class GoogleCalendarModule {} 
