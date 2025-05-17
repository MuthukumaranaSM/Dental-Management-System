import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Popconfirm,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { authApi } from '../../services/api';

const { Option } = Select;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  specialization?: string;
  licenseNumber?: string;
  shift?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const fetchUsers = async () => {
    try {
      const response = await authApi.getAllUsers();
      setUsers(response);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (values: any) => {
    setLoading(true);
    try {
      await authApi.createUser(values);
      message.success('User created successfully. A verification email has been sent to their email address.');
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <span style={{ textTransform: 'capitalize' }}>
          {role.toLowerCase().replace('_', ' ')}
        </span>
      ),
    },
    {
      title: 'Specialization/Shift',
      key: 'specialization',
      render: (_: any, record: User) => record.specialization || record.shift || '-',
    },
    {
      title: 'License Number',
      dataIndex: 'licenseNumber',
      key: 'licenseNumber',
      render: (text: string) => text || '-',
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          form.resetFields();
          setSelectedRole('');
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Create User
      </Button>

      <Table columns={columns} dataSource={users} rowKey="id" />

      <Modal
        title="Create User"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setSelectedRole('');
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateUser}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input the password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select onChange={(value) => setSelectedRole(value)}>
              <Option value="DENTIST">Dentist</Option>
              <Option value="RECEPTIONIST">Receptionist</Option>
            </Select>
          </Form.Item>

          {selectedRole === 'DENTIST' && (
            <>
              <Form.Item
                name="specialization"
                label="Specialization"
                rules={[{ required: true, message: 'Please input the specialization!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="licenseNumber"
                label="License Number"
                rules={[{ required: true, message: 'Please input the license number!' }]}
              >
                <Input />
              </Form.Item>
            </>
          )}

          {selectedRole === 'RECEPTIONIST' && (
            <Form.Item
              name="shift"
              label="Shift"
              rules={[{ required: true, message: 'Please select a shift!' }]}
            >
              <Select>
                <Option value="MORNING">Morning</Option>
                <Option value="EVENING">Evening</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
