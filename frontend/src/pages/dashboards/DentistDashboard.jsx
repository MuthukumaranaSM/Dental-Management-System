import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Button, Stack } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import UserCreationForm from '../../components/UserCreationForm';
import './DashboardStyles.css';

const DentistDashboard = () => {
  const { user } = useAuth();
  const [isCreatePatientOpen, setCreatePatientOpen] = useState(false);

  return (
    <Container maxWidth="xl" className="dashboard-container">
      <Grid container spacing={3} className="dashboard-grid">
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper className="dashboard-card welcome-card" sx={{ p: 4 }}>
            <Typography className="welcome-title">
              Welcome back, Dr. {user?.lastName || 'Doctor'}
            </Typography>
            <Typography className="welcome-subtitle">
              License: {user?.licenseNumber}
            </Typography>
          </Paper>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} md={8}>
          <Paper className="dashboard-card" sx={{ p: 3 }}>
            <Typography className="section-title">Today's Schedule</Typography>
            <Grid container spacing={4}>
              {[
                { label: 'Appointments', value: '0' },
                { label: 'Completed', value: '0' },
                { label: 'Pending', value: '0' },
                { label: 'Cancelled', value: '0' }
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
                onClick={() => setCreatePatientOpen(true)}
              >
                Register New Patient
              </Button>
              <Button 
                component={Link} 
                to="/appointments/manage"
                className="action-button secondary-action"
              >
                Manage Appointments
              </Button>
              <Button 
                component={Link} 
                to="/patients"
                className="action-button secondary-action"
              >
                View Patient Records
              </Button>
              <Button 
                component={Link} 
                to="/schedule"
                className="action-button secondary-action"
              >
                View Full Schedule
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12}>
          <Paper className="dashboard-card" sx={{ p: 3 }}>
            <Typography className="section-title">Upcoming Appointments</Typography>
            <Typography className="empty-state">
              No upcoming appointments scheduled
            </Typography>
          </Paper>
        </Grid>

        {/* Patient Creation Dialog */}
        <UserCreationForm 
          open={isCreatePatientOpen}
          onClose={() => setCreatePatientOpen(false)}
          allowedRoles={['PATIENT']}
        />
      </Grid>
    </Container>
  );
};

export default DentistDashboard;