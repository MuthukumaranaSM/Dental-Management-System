import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Input,
  message,
  Space,
  Popconfirm,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../services/api';

interface BlockedSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

const BlockSlots: React.FC = () => {
  const { user } = useAuth();
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchBlockedSlots = async () => {
    if (!user?.id) {
      message.error('User not authenticated');
      return;
    }

    try {
      const startDate = dayjs().format('YYYY-MM-DD');
      const endDate = dayjs().add(1, 'year').format('YYYY-MM-DD');
      const response = await appointmentApi.getBlockedSlots(
        user.id.toString(),
        startDate,
        endDate
      );
      setBlockedSlots(response);
    } catch (error) {
      message.error('Failed to fetch blocked slots');
    }
  };

  useEffect(() => {
    fetchBlockedSlots();
  }, [user?.id]);

  const handleBlockSlot = async (values: any) => {
    setLoading(true);
    try {
      const formattedValues = {
        date: values.date.format('YYYY-MM-DD'),
        startTime: values.timeRange[0].format('HH:mm'),
        endTime: values.timeRange[1].format('HH:mm'),
        reason: values.reason
      };

      await appointmentApi.blockTimeSlot(formattedValues);
      message.success('Time slot blocked successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchBlockedSlots();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to block time slot');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockSlot = async (slotId: string) => {
    try {
      await appointmentApi.unblockTimeSlot(slotId);
      message.success('Time slot unblocked successfully');
      fetchBlockedSlots();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to unblock time slot');
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: BlockedSlot) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to unblock this time slot?"
            onConfirm={() => handleUnblockSlot(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
        loading={loading}
      >
        Block Time Slot
      </Button>

      <Table columns={columns} dataSource={blockedSlots} rowKey="id" />

      <Modal
        title="Block Time Slot"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleBlockSlot} layout="vertical">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select a date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="Time Range"
            rules={[{ required: true, message: 'Please select a time range!' }]}
          >
            <TimePicker.RangePicker style={{ width: '100%' }} format="HH:mm" />
          </Form.Item>

          <Form.Item name="reason" label="Reason">
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Block Slot
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlockSlots;
