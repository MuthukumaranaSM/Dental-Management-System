import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, message } from 'antd';
import { api } from '../services/api';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { appointmentApi } from '../services/api';

interface GenerateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    customer: {
      name: string;
      email: string;
      phoneNumber: string;
    };
    date: string;
    time: string;
    service: string;
  };
}

interface BillFormData {
  serviceDescription: string;
  amount: number;
  additionalNotes?: string;
}

// PDF Document Component
const BillPDF = ({ billData, appointment }: { billData: BillFormData; appointment: GenerateBillModalProps['appointment'] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Dental Clinic Bill</Text>
        <Text style={styles.date}>Date: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <Text>Name: {appointment.customer.name}</Text>
        <Text>Email: {appointment.customer.email}</Text>
        <Text>Phone: {appointment.customer.phoneNumber}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appointment Details</Text>
        <Text>Date: {appointment.date}</Text>
        <Text>Time: {appointment.time}</Text>
        <Text>Service: {appointment.service}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bill Details</Text>
        <Text>Service: {billData.serviceDescription}</Text>
        <Text>Amount: LKR {billData.amount.toFixed(2)}</Text>
        {billData.additionalNotes && (
          <Text>Notes: {billData.additionalNotes}</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.total}>Total Amount: LKR {billData.amount.toFixed(2)}</Text>
        <Text style={styles.thankYou}>Thank you for choosing our services!</Text>
      </View>
    </Page>
  </Document>
);

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footer: {
    marginTop: 30,
    borderTop: 1,
    paddingTop: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  thankYou: {
    fontSize: 12,
    color: '#666',
  },
});

export const GenerateBillModal: React.FC<GenerateBillModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  const [form] = Form.useForm();
  const [billData, setBillData] = useState<BillFormData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: BillFormData) => {
    try {
      setLoading(true);
      await appointmentApi.generateBill(appointment.id, values);
      setBillData(values);
      message.success('Bill generated successfully');
    } catch (error) {
      message.error('Failed to generate bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Generate Bill"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {!billData ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            serviceDescription: appointment.service,
          }}
        >
          <Form.Item
            name="serviceDescription"
            label="Service Description"
            rules={[{ required: true, message: 'Please enter service description' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount (LKR)"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            name="additionalNotes"
            label="Additional Notes"
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Generate Bill
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <PDFDownloadLink
            document={<BillPDF billData={billData} appointment={appointment} />}
            fileName={`bill-${appointment.id}.pdf`}
          >
            {({ loading }) => (
              <Button type="primary" loading={loading}>
                Download Bill
              </Button>
            )}
          </PDFDownloadLink>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => {
              setBillData(null);
              form.resetFields();
            }}
          >
            Generate New Bill
          </Button>
        </div>
      )}
    </Modal>
  );
}; 
