import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  MenuItem,
  Select,
  FormControl,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { appointmentApi } from '../services/api';
import { format } from 'date-fns';

interface Appointment {
  id: number;
  appointmentDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  reason: string;
  customer: {
    name: string;
    email: string;
  };
  dentist: {
    name: string;
  };
}

export default function ReceptionistDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentApi.getReceptionistAppointments();
      setAppointments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      await appointmentApi.updateAppointmentStatus(
        appointmentId,
        newStatus as 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
      );
      setSuccessMessage('Appointment status updated successfully');
      fetchAppointments(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update appointment status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return '#4caf50';
      case 'CANCELLED':
        return '#f44336';
      case 'COMPLETED':
        return '#2196f3';
      default:
        return '#ff9800';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Appointment Management
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Patient Email</TableCell>
              <TableCell>Dentist</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {format(new Date(appointment.appointmentDate), 'PPp')}
                </TableCell>
                <TableCell>{appointment.customer.name}</TableCell>
                <TableCell>{appointment.customer.email}</TableCell>
                <TableCell>{appointment.dentist.name}</TableCell>
                <TableCell>{appointment.reason}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: getStatusColor(appointment.status),
                      fontWeight: 'bold',
                    }}
                  >
                    {appointment.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  {appointment.status === 'PENDING' && (
                    <FormControl size="small">
                      <Select
                        value=""
                        displayEmpty
                        onChange={(e) =>
                          handleStatusChange(appointment.id, e.target.value)
                        }
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="" disabled>
                          Change Status
                        </MenuItem>
                        <MenuItem value="CONFIRMED">Confirm</MenuItem>
                        <MenuItem value="CANCELLED">Cancel</MenuItem>
                        <MenuItem value="COMPLETED">Complete</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
