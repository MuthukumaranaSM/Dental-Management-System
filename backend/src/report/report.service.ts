import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as PDFDocument from 'pdfkit';
import { format } from 'date-fns';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async generateDentistMonthlyReport(dentistId: number, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get all appointments for the dentist in the specified month
    const appointments = await this.prisma.appointment.findMany({
      where: {
        dentistId: dentistId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        symptoms: {
          include: {
            symptom: true,
          },
        },
      },
      orderBy: {
        appointmentDate: 'asc',
      },
    });

    // Get all prescriptions for patients who had appointments with this dentist
    const patientIds = appointments.map(app => app.customerId);
    const prescriptions = await this.prisma.prescription.findMany({
      where: {
        patientId: {
          in: patientIds,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        patient: true,
      },
    });

    // Create PDF document
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));

    // Add title
    doc.fontSize(20).text('Monthly Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Month: ${format(startDate, 'MMMM yyyy')}`, { align: 'center' });
    doc.moveDown();

    // Add appointment statistics
    doc.fontSize(14).text('Appointment Statistics', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Total Appointments: ${appointments.length}`);
    doc.text(`Completed Appointments: ${appointments.filter(a => a.status === 'COMPLETED').length}`);
    doc.text(`Cancelled Appointments: ${appointments.filter(a => a.status === 'CANCELLED').length}`);
    doc.moveDown();

    // Add appointment details
    doc.fontSize(14).text('Appointment Details', { underline: true });
    doc.moveDown();

    appointments.forEach(appointment => {
      doc.fontSize(12).text(`Date: ${format(new Date(appointment.appointmentDate), 'MMM dd, yyyy hh:mm a')}`);
      doc.text(`Patient: ${appointment.customer.name}`);
      doc.text(`Status: ${appointment.status}`);
      doc.text(`Reason: ${appointment.reason}`);
      doc.text('Symptoms:');
      appointment.symptoms.forEach(s => {
        doc.text(`- ${s.symptom.name}`);
      });
      doc.moveDown();
    });

    // Add prescription details
    doc.fontSize(14).text('Prescription Details', { underline: true });
    doc.moveDown();

    prescriptions.forEach(prescription => {
      doc.fontSize(12).text(`Patient: ${prescription.patient.name}`);
      doc.text(`Medication: ${prescription.medication}`);
      doc.text(`Dosage: ${prescription.dosage}`);
      doc.text(`Instructions: ${prescription.instructions}`);
      doc.text(`Date: ${format(new Date(prescription.createdAt), 'MMM dd, yyyy')}`);
      doc.moveDown();
    });

    // Finalize PDF
    doc.end();

    return new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
    });
  }
} 
