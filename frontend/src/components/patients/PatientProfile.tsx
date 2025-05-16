import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  IconButton,
  Alert,
  Snackbar,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  History as HistoryIcon,
  Event as EventIcon,
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Cake as CakeIcon,
  Wc as GenderIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentApi, prescriptionApi, patientApi } from '../../services/api';

interface PatientInfo {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  address: string;
  allergies: string[];
  medicalHistory: string;
  appointments: Appointment[];
  prescriptions: Prescription[];
}

interface Appointment {
  id: number;
  appointmentDate: string;
  status: string;
  reason: string;
  notes: string;
}

interface Prescription {
  id: number;
  medication: string;
  dosage: string;
  instructions: string;
  createdAt: string;
}

const PatientProfile = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);
      const patientInfo = await patientApi.getPatientDetails(patientId);
      setPatientInfo(patientInfo);
      setAppointments(patientInfo.appointments);
      setPrescriptions(patientInfo.prescriptions);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setError('Failed to load patient details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'CONFIRMED':
        return 'primary';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon fontSize="small" />;
      case 'CONFIRMED':
        return <ScheduleIcon fontSize="small" />;
      case 'PENDING':
        return <WarningIcon fontSize="small" />;
      case 'CANCELLED':
        return <WarningIcon fontSize="small" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!patientInfo) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="error">Patient not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <IconButton 
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
              size="large"
            >
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
              {patientInfo.name.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {patientInfo.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<PersonIcon />}
                label={`ID: ${patientInfo.id}`}
                variant="outlined"
              />
              <Chip
                icon={<EmailIcon />}
                label={patientInfo.email}
                variant="outlined"
              />
              <Chip
                icon={<PhoneIcon />}
                label={patientInfo.phoneNumber || 'No phone number'}
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Info Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CakeIcon color="primary" />
                Personal Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Date of Birth:</strong> {format(new Date(patientInfo.dateOfBirth), 'PPP')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Gender:</strong> {patientInfo.gender}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {patientInfo.address || 'No address provided'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MedicalIcon color="primary" />
                Medical Summary
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Allergies:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {patientInfo.allergies.length > 0 ? (
                    patientInfo.allergies.map((allergy, index) => (
                      <Chip
                        key={index}
                        label={allergy}
                        color="error"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No known allergies
                    </Typography>
                  )}
                </Box>
                <Typography variant="subtitle2" gutterBottom>
                  Medical History:
                </Typography>
                <Typography variant="body2">
                  {patientInfo.medicalHistory || 'No medical history recorded'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon color="primary" />
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Last Appointment:</strong>
                </Typography>
                {appointments.length > 0 ? (
                  <Box>
                    <Typography variant="body2">
                      {format(new Date(appointments[0].appointmentDate), 'PPP')}
                    </Typography>
                    <Chip
                      size="small"
                      label={appointments[0].status}
                      color={getStatusColor(appointments[0].status)}
                      icon={getStatusIcon(appointments[0].status)}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No appointments found
                  </Typography>
                )}
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" gutterBottom>
                  <strong>Active Prescriptions:</strong>
                </Typography>
                {prescriptions.length > 0 ? (
                  <Typography variant="body2">
                    {prescriptions.length} active prescription(s)
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No active prescriptions
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<HistoryIcon />} 
            label="Appointment History" 
            iconPosition="start"
          />
          <Tab 
            icon={<MedicalIcon />} 
            label="Prescriptions" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon color="primary" />
              Appointment History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id} hover>
                      <TableCell>
                        {format(new Date(appointment.appointmentDate), 'PPP p')}
                      </TableCell>
                      <TableCell>{appointment.reason}</TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.status}
                          color={getStatusColor(appointment.status)}
                          icon={getStatusIcon(appointment.status)}
                        />
                      </TableCell>
                      <TableCell>{appointment.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MedicalIcon color="primary" />
              Prescription History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Medication</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Instructions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prescriptions.map((prescription) => (
                    <TableRow key={prescription.id} hover>
                      <TableCell>
                        {format(new Date(prescription.createdAt), 'PPP')}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {prescription.medication}
                        </Typography>
                      </TableCell>
                      <TableCell>{prescription.dosage}</TableCell>
                      <TableCell>
                        <Tooltip title={prescription.instructions}>
                          <Typography variant="body2" noWrap>
                            {prescription.instructions}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PatientProfile; 
