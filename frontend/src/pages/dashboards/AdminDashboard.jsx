import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Button, Box, Stack } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import UserCreationForm from '../../components/UserCreationForm';
import './DashboardStyles.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isCreateUserOpen, setCreateUserOpen] = useState(false);
  const allowedRoles = ['ADMIN', 'DENTIST', 'PATIENT', 'RECEPTIONIST'];

  return (
    <Container maxWidth="xl" className="dashboard-container">
      <Grid container spacing={3} className="dashboard-grid">
        {/* Welcome Card */}
        <Grid item xs={12}>
          <Paper className="dashboard-card welcome-card" sx={{ p: 4 }}>
            <Typography className="welcome-title">
              Welcome back, Admin
            </Typography>
            <Typography className="welcome-subtitle">
              Manage your dental practice efficiently
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={8}>
          <Paper className="dashboard-card" sx={{ p: 3 }}>
            <Typography className="section-title">System Overview</Typography>
            <Grid container spacing={4}>
              {[
                { label: 'Total Users', value: '0' },
                { label: 'Active Dentists', value: '0' },
                { label: 'Patients', value: '0' },
                { label: 'Staff', value: '0' }
              ].map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Typography className="stat-value">{stat.value}</Typography>
                  <Typography className="stat-label">{stat.label}</Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper className="dashboard-card" sx={{ p: 3 }}>
            <Typography className="section-title">Quick Actions</Typography>
            <Stack spacing={2}>
              <Button 
                className="action-button primary-action"
                onClick={() => setCreateUserOpen(true)}
              >
                Create New User
              </Button>
              <Button 
                component={Link} 
                to="/admin/users"
                className="action-button secondary-action"
              >
                Manage Users
              </Button>
              <Button 
                component={Link} 
                to="/admin/staff"
                className="action-button secondary-action"
              >
                Manage Staff
              </Button>
              <Button 
                component={Link} 
                to="/admin/settings"
                className="action-button secondary-action"
              >
                System Settings
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper className="dashboard-card" sx={{ p: 3 }}>
            <Typography className="section-title">Recent Activity</Typography>
            <Typography className="empty-state">
              No recent activity to display
            </Typography>
          </Paper>
        </Grid>

        {/* User Creation Dialog */}
        <UserCreationForm 
          open={isCreateUserOpen}
          onClose={() => setCreateUserOpen(false)}
          allowedRoles={allowedRoles}
        />
      </Grid>
    </Container>
  );
};

export default AdminDashboard;