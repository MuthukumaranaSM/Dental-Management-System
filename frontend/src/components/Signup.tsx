import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Link, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER'
  });

  const isFromAppointment = location.state?.from === 'appointment';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await authApi.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      // Show verification message instead of logging in immediately
      setShowVerificationMessage(true);
      
      // Store the token and user data for later use after verification
      localStorage.setItem('pendingAuth', JSON.stringify(response));
      
    } catch (err) {
      setError('Failed to create account');
    }
  };

  if (showVerificationMessage) {
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
          <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Please verify your email
            </Typography>
            <Typography>
              We've sent a verification link to {formData.email}. Please check your email and click the link to verify your account.
            </Typography>
            <Typography sx={{ mt: 2 }}>
              After verifying your email, you can <Link component={RouterLink} to="/login">log in</Link> to your account.
            </Typography>
          </Alert>
        </Box>
      </Container>
    );
  }

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
          Sign up
        </Typography>
        {isFromAppointment && (
          <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
            To book an appointment, you need to create an account first.
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="CUSTOMER">Customer</MenuItem>
              {/* <MenuItem value="DENTIST">Dentist</MenuItem>
              <MenuItem value="RECEPTIONIST">Receptionist</MenuItem> */}
            </Select>
          </FormControl>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
} 
