import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, Alert, CircularProgress, Button } from '@mui/material';
import { authApi } from '../services/api';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const hasAttemptedVerification = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent multiple verification attempts
      if (hasAttemptedVerification.current) return;
      hasAttemptedVerification.current = true;
      
      try {
        const token = searchParams.get('token');
        if (!token) {
          setStatus('error');
          setMessage('Invalid verification link');
          return;
        }

        await authApi.verifyEmail(token);
        setStatus('success');
        setMessage('Email verified successfully! You can now log in.');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        if (error.response?.status === 400) {
          setMessage('This verification link has already been used or has expired. Please try logging in or request a new verification link.');
        } else {
          setMessage('Failed to verify email. Please try again later.');
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleGoToLogin = () => {
    navigate('/login');
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
        {status === 'loading' && (
          <>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Verifying your email...
            </Typography>
          </>
        )}

        {status === 'success' && (
          <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
            {message}
          </Alert>
        )}

        {status === 'error' && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {message}
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" onClick={handleGoToLogin}>
                Go to Login
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
} 
