import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('user')
  async getUserNotifications(@Request() req) {
    return this.notificationService.getUserNotifications(req.user.userId);
  }

  @Post(':id/read')
  async markNotificationAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationService.markNotificationAsRead(Number(id), req.user.userId);
  }

  @Post('read-all')
  async markAllNotificationsAsRead(@Request() req) {
    return this.notificationService.markAllNotificationsAsRead(req.user.userId);
  }
} 
