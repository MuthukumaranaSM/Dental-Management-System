import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
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
}
