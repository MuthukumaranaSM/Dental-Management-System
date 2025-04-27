import React from 'react';
import { Container, Grid, Paper, Typography, Button, Stack } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './DashboardStyles.css';

const PatientDashboard = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="xl" className="dashboard-container">
      <Grid container spacing={3} className="dashboard-grid">
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper className="dashboard-card welcome-card" sx={{ p: 4 }}>
            <Typography className="welcome-title">
              Welcome back, {user?.firstName || 'Patient'}
            </Typography>
            <Typography className="welcome-subtitle">
              Let's take care of your dental health
            </Typography>
          </Paper>
        </Grid>

        {/* Appointment Overview */}
        <Grid item xs={12} md={8}>
          <Paper className="dashboard-card" sx={{ p: 3 }}>
            <Typography className="section-title">Your Dental Care</Typography>
            <Grid container spacing={4}>
              {[
                { label: 'Total Visits', value: '0' },
                { label: 'Upcoming', value: '0' },
                { label: 'Completed', value: '0' },
                { label: 'Treatments', value: '0' }
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
                component={Link} 
                to="/appointments/book"
                className="action-button primary-action"
              >
                Book New Appointment
              </Button>
              <Button 
                component={Link} 
                to="/appointments"
                className="action-button secondary-action"
              >
                View My Appointments
              </Button>
              <Button 
                component={Link} 
                to="/medical-records"
                className="action-button secondary-action"
              >
                Medical Records
              </Button>
              <Button 
                component={Link} 
                to="/treatments"
                className="action-button secondary-action"
              >
                Treatment History
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Next Appointment */}
        <Grid item xs={12}>
          <Paper className="dashboard-card" sx={{ p: 3 }}>
            <Typography className="section-title">Next Appointment</Typography>
            <Typography className="empty-state">
              No upcoming appointments scheduled
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboard;