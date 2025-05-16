import React from 'react';
import { Layout, Menu } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import BlockSlots from '../components/dentist/BlockSlots';
import { dashboardStyles } from '../components/dashboard/DashboardStyles';

const { Header, Content, Sider } = Layout;

const DentistDashboard: React.FC = () => {
  return (
    <div style={dashboardStyles.container}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ padding: '0 24px', fontSize: '20px', fontWeight: 'bold' }}>
            Dentist Dashboard
          </div>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1" icon={<CalendarOutlined />}>
                Block Time Slots
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
              <BlockSlots />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default DentistDashboard;
