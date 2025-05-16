import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UserManagement from '../components/admin/UserManagement';
import { dashboardStyles } from '../components/dashboard/DashboardStyles';

const { Header, Content, Sider } = Layout;

const AdminDashboard: React.FC = () => {
  return (
    <div style={dashboardStyles.container}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ padding: '0 24px', fontSize: '20px', fontWeight: 'bold' }}>
            Admin Dashboard
          </div>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1" icon={<UserOutlined />}>
                User Management
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: '#fff',
              }}
            >
              <UserManagement />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default AdminDashboard;
