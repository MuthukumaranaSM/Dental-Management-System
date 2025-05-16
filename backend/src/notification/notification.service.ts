import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createAppointmentNotification(
    userId: number,
    appointmentId: number,
    status: AppointmentStatus,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        customer: true,
        dentist: true,
      },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    let title = '';
    let message = '';

    if (status === AppointmentStatus.CONFIRMED) {
      title = 'Appointment Confirmed';
      message = `Your appointment with Dr. ${appointment.dentist.name} has been confirmed for ${appointment.appointmentDate.toLocaleString()}`;
    } else if (status === AppointmentStatus.CANCELLED) {
      title = 'Appointment Cancelled';
      message = `Your appointment with Dr. ${appointment.dentist.name} scheduled for ${appointment.appointmentDate.toLocaleString()} has been cancelled`;
    }

    return this.prisma.notification.create({
      data: {
        title,
        message,
        type: `APPOINTMENT_${status}`,
        userId,
        appointmentId,
      },
    });
  }

  async getUserNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markNotificationAsRead(notificationId: number, userId: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new UnauthorizedException('You can only mark your own notifications as read');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllNotificationsAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
} 
