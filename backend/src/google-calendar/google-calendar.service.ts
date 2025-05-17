import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleCalendarService {
  constructor(private configService: ConfigService) {}

  generateGoogleCalendarLink(eventDetails: {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
  }) {
    try {
      const baseUrl = 'https://calendar.google.com/calendar/render';
      
      // Format dates for Google Calendar URL
      const formatDate = (date: Date) => {
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date provided');
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
      };

      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: eventDetails.title,
        details: eventDetails.description,
        dates: `${formatDate(eventDetails.startTime)}/${formatDate(eventDetails.endTime)}`,
      });

      return `${baseUrl}?${params.toString()}`;
    } catch (error) {
      console.error('Error generating calendar link:', error);
      throw new Error('Failed to generate calendar link: ' + error.message);
    }
  }
} 
