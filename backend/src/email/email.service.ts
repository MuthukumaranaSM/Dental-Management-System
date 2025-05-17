import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    private googleCalendarService: GoogleCalendarService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;
    
    console.log('Sending verification email to:', email);
    console.log('Verification URL:', verificationUrl);

    const mailOptions = {
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <h1>Welcome to Our Dental Clinic!</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email Address</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not create an account, please ignore this email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You have requested to reset your password. Click the link below to set a new password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendAppointmentConfirmation(
    to: string,
    appointmentDetails: {
      date: Date;
      startTime: string;
      endTime: string;
      dentistName: string;
      reason: string;
      status: string;
    },
  ) {
    const { date, startTime, endTime, dentistName, reason, status } = appointmentDetails;
    
    const formattedDate = new Date(date).toLocaleDateString();
    const subject = `Appointment ${status} - ${formattedDate}`;

    try {
      // Parse start and end times
      const startTimeParts = startTime.split(':');
      const endTimeParts = endTime.split(':');

      if (startTimeParts.length < 2 || endTimeParts.length < 2) {
        throw new Error('Invalid time format. Expected HH:mm');
      }

      const startHours = parseInt(startTimeParts[0], 10);
      const startMinutes = parseInt(startTimeParts[1], 10);
      const endHours = parseInt(endTimeParts[0], 10);
      const endMinutes = parseInt(endTimeParts[1], 10);

      if (isNaN(startHours) || isNaN(startMinutes) || isNaN(endHours) || isNaN(endMinutes)) {
        throw new Error('Invalid time values');
      }

      // Create start and end date objects
      const startDateTime = new Date(date);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date(date);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      // Generate Google Calendar link
      const calendarLink = this.googleCalendarService.generateGoogleCalendarLink({
        title: `Dental Appointment with Dr. ${dentistName}`,
        description: `Appointment for: ${reason}`,
        startTime: startDateTime,
        endTime: endDateTime,
      });
      
      const html = `
        <h2>Appointment Details</h2>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        <p><strong>Dentist:</strong> ${dentistName}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Status:</strong> ${status}</p>
        <br>
        <p>Add this appointment to your Google Calendar:</p>
        <a href="${calendarLink}" style="background-color: #4285f4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Add to Google Calendar
        </a>
      `;

      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_USER'),
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending appointment confirmation email:', error);
      // Send email without calendar link if there's an error
      const html = `
        <h2>Appointment Details</h2>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        <p><strong>Dentist:</strong> ${dentistName}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Status:</strong> ${status}</p>
      `;

      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_USER'),
        to,
        subject,
        html,
      });
    }
  }
}
