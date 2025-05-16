import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Avatar,
  Chip,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  Badge as BadgeIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { authApi, appointmentApi } from '../services/api';
import { format } from 'date-fns';

interface UserDetails {
  id: number;
  name: string;
  email: string;
  role: string;
  specialization?: string;
  licenseNumber?: string;
  shift?: string;
  createdAt: string;
  updatedAt: string;
}

interface Bill {
  id: number;
  amount: number;
  serviceDescription: string;
  additionalNotes?: string;
  status: string;
  createdAt: string;
  appointment: {
    dentist: {
      name: string;
    };
  };
}

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, billsResponse] = await Promise.all([
          authApi.getUserById(id!),
          appointmentApi.getUserBills(id!),
        ]);
        setUser(userResponse);
        setBills(billsResponse);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="error">
          {error || 'User not found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }} size="large">
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {user.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<PersonIcon />}
                label={`ID: ${user.id}`}
                variant="outlined"
              />
              <Chip
                icon={<EmailIcon />}
                label={user.email}
                variant="outlined"
              />
              <Chip
                icon={<WorkIcon />}
                label={user.role}
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Details Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                Personal Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Name:</strong> {user.name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Role:</strong> {user.role}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon color="primary" />
                Professional Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                {user.specialization && (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Specialization:</strong> {user.specialization}
                  </Typography>
                )}
                {user.licenseNumber && (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>License Number:</strong> {user.licenseNumber}
                  </Typography>
                )}
                {user.shift && (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Shift:</strong> {user.shift}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bills Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptIcon color="primary" />
                Bill History
              </Typography>
              {bills.length === 0 ? (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  No bills found for this user.
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Dentist</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bills.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell>
                            {format(new Date(bill.createdAt), 'PPp')}
                          </TableCell>
                          <TableCell>{bill.serviceDescription}</TableCell>
                          <TableCell>{bill.appointment.dentist.name}</TableCell>
                          <TableCell>LKR {bill.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip
                              label={bill.status}
                              color={bill.status === 'PAID' ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{bill.additionalNotes || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDetails; 
