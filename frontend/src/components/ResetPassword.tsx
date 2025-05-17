import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Alert } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    if (!token) {
      setStatus('error');
      setMessage('Invalid reset token');
      return;
    }

    setStatus('loading');

    try {
      const response = await authApi.resetPassword(token, newPassword);
      setStatus('success');
      setMessage(response.message);
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to reset password. Please try again.');
    }
  };

  if (!token) {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="error">Invalid or missing reset token</Alert>
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
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Please enter your new password
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
          />

          {status === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}

          {status === 'error' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 
