import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Alert } from '@mui/material';
import { authApi } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await authApi.requestPasswordReset(email);
      setStatus('success');
      setMessage(response.message);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to send password reset email. Please try again.');
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
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
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
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 
