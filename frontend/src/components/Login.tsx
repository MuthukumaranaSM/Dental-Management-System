import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Link, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const isFromAppointment = location.state?.from === 'appointment';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authApi.login(formData);
      
      if (!response.user.isEmailVerified) {
        setError('Please verify your email before logging in. Check your inbox for the verification link.');
        return;
      }

      login(response.token, response.user);
      
      // Check if there's a pending appointment
      const pendingAppointment = localStorage.getItem('pendingAppointment');
      if (pendingAppointment) {
        localStorage.removeItem('pendingAppointment');
        navigate('/appointments/new', { state: { appointmentData: JSON.parse(pendingAppointment) } });
      } else {
        if (response.user.role === 'CUSTOMER') {
          navigate('/dashboard');
        } else if (response.user.role === 'DENTIST') {
          navigate('/dentist-dashboard');
        } else if (response.user.role === 'RECEPTIONIST') {
          navigate('/receptionist-dashboard');
        } else if (response.user.role === 'MAIN_DOCTOR') {
          navigate('/main-doctor-dashboard');
        } else {
          navigate('/unauthorized');
        }
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {isFromAppointment && (
          <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
            To book an appointment, you need to sign in first.
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
} 
