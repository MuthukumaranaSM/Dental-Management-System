import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { format, addDays, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import {
  Event as EventIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Done as DoneIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { dashboardStyles } from './DashboardStyles';
import { appointmentApi, prescriptionApi } from '../../services/api';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface Appointment {
  id: number;
  appointmentDate: string;
  status: string;
  reason: string;
  createdAt: string;
  symptoms: {
    symptom: {
      id: number;
      name: string;
    }
  }[];
  customer: {
    id: number;
    name: string;
    email: string;
  };
}

interface Prescription {
  id: number;
  patientId: number;
  medication: string;
  dosage: string;
  instructions: string;
  createdAt: string;
}

interface BlockedSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

const API_URL = 'http://localhost:3000';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM'
];

// PDF Document Component
const MonthlyReportPDF = ({ 
  appointments, 
  prescriptions, 
  month, 
  year 
}: { 
  appointments: Appointment[], 
  prescriptions: Prescription[], 
  month: string, 
  year: number 
}) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      {/* Clinic Header */}
      <View style={styles.clinicHeader} fixed>
        <Text style={styles.clinicName}>Beliaththa Dental Clinic</Text>
      </View>
      {/* Report Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Monthly Dental Practice Report</Text>
        <Text style={styles.date}>{month} {year}</Text>
      </View>
      {/* Divider */}
      <View style={styles.divider} />
      {/* Monthly Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Statistics</Text>
        <Text>Total Appointments: {appointments.length}</Text>
        <Text>Completed Appointments: {appointments.filter(a => a.status === 'COMPLETED').length}</Text>
        <Text>Cancelled Appointments: {appointments.filter(a => a.status === 'CANCELLED').length}</Text>
        <Text>Total Prescriptions: {prescriptions.length}</Text>
        <Text>Total Patients: {new Set(appointments.map(a => a.customer.id)).size}</Text>
      </View>
      <View style={styles.divider} />
      {/* Appointment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appointment Details</Text>
        {appointments.length === 0 ? (
          <Text>No appointments found for this month.</Text>
        ) : appointments.map((appointment, index) => (
          <View key={index} style={styles.detailBlock} wrap={false}>
            <Text style={styles.detailLabel}>Patient:</Text> <Text style={styles.detailValue}>{appointment.customer.name}</Text>
            <Text style={styles.detailLabel}>Date:</Text> <Text style={styles.detailValue}>{format(new Date(appointment.appointmentDate), 'MMM d, yyyy hh:mm a')}</Text>
            <Text style={styles.detailLabel}>Status:</Text> <Text style={styles.detailValue}>{appointment.status}</Text>
            <Text style={styles.detailLabel}>Reason:</Text> <Text style={styles.detailValue}>{appointment.reason}</Text>
            {appointment.symptoms && appointment.symptoms.length > 0 && (
              <Text style={styles.detailLabel}>Symptoms:</Text>
            )}
            {appointment.symptoms && appointment.symptoms.length > 0 && (
              <Text style={styles.detailValue}>{appointment.symptoms.map(s => s.symptom.name).join(', ')}</Text>
            )}
            <View style={styles.detailDivider} />
          </View>
        ))}
      </View>
      <View style={styles.divider} />
      {/* Prescription Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prescription Details</Text>
        {prescriptions.length === 0 ? (
          <Text>No prescriptions found for this month.</Text>
        ) : prescriptions.map((prescription, index) => (
          <View key={index} style={styles.detailBlock} wrap={false}>
            <Text style={styles.detailLabel}>Patient:</Text> <Text style={styles.detailValue}>{(() => { const appt = appointments.find(a => a.customer.id === prescription.patientId); return appt ? appt.customer.name : 'Unknown'; })()}</Text>
            <Text style={styles.detailLabel}>Medication:</Text> <Text style={styles.detailValue}>{prescription.medication}</Text>
            <Text style={styles.detailLabel}>Dosage:</Text> <Text style={styles.detailValue}>{prescription.dosage}</Text>
            <Text style={styles.detailLabel}>Instructions:</Text> <Text style={styles.detailValue}>{prescription.instructions}</Text>
            <Text style={styles.detailLabel}>Date:</Text> <Text style={styles.detailValue}>{format(new Date(prescription.createdAt), 'MMM d, yyyy')}</Text>
            <View style={styles.detailDivider} />
          </View>
        ))}
      </View>
      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>Beliaththa Dental Clinic | Page <Text render={({ pageNumber }) => `${pageNumber}`}/></Text>
      </View>
    </Page>
  </Document>
);

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
    backgroundColor: '#fff',
  },
  clinicHeader: {
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#1565c0',
    borderBottomStyle: 'solid',
    alignItems: 'center',
  },
  clinicName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565c0',
    textAlign: 'center',
    letterSpacing: 1,
  },
  header: {
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  date: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
    marginVertical: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1565c0',
  },
  detailBlock: {
    marginBottom: 8,
    padding: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
    marginRight: 2,
    display: 'inline',
  },
  detailValue: {
    fontSize: 12,
    color: '#222',
    marginLeft: 2,
    display: 'inline',
  },
  detailDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
    marginVertical: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: '#1565c0',
    borderTopStyle: 'solid',
    paddingTop: 4,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#1565c0',
    textAlign: 'center',
  },
});

const DentistDashboard = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [openPrescriptionDialog, setOpenPrescriptionDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    medication: '',
    dosage: '',
    instructions: '',
  });
  const [patientFilter, setPatientFilter] = useState<'all' | 'confirmed' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState<Appointment | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
      fetchBlockedSlots();
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchAllPrescriptions = async () => {
      if (appointments.length > 0) {
        try {
          setLoading(true);
          // Fetch prescriptions for all patients
          const allPrescriptions = await Promise.all(
            appointments.map(appointment => 
              prescriptionApi.getPatientPrescriptions(appointment.customer.id)
            )
          );
          // Flatten the array of prescription arrays
          const flattenedPrescriptions = allPrescriptions.flat();
          setPrescriptions(flattenedPrescriptions);
        } catch (err) {
          console.error('Error fetching prescriptions:', err);
          setError('Failed to fetch prescriptions');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAllPrescriptions();
  }, [appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentApi.getDentistAppointments(user?.id.toString() || '');
      setAppointments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async (patientId: number) => {
    try {
      setLoading(true);
      const data = await prescriptionApi.getPatientPrescriptions(patientId);
      console.log('Fetched prescriptions:', data);
      setPrescriptions(data);
    } catch (err: any) {
      console.error('Error fetching prescriptions:', err);
      setError('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrescription = async () => {
    if (!selectedPatient) return;

    try {
      setLoading(true);
      const response = await prescriptionApi.create({
        patientId: selectedPatient.customer.id,
        ...prescriptionForm,
      });
      
      console.log('Created prescription:', response);
      setSuccessMessage('Prescription added successfully');
      
      await fetchPrescriptions(selectedPatient.customer.id);
      
      setOpenPrescriptionDialog(false);
      setPrescriptionForm({ medication: '', dosage: '', instructions: '' });
    } catch (err: any) {
      console.error('Error adding prescription:', err);
      setError(err.response?.data?.message || 'Failed to add prescription');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrescription = async (prescriptionId: number) => {
    try {
      await prescriptionApi.delete(prescriptionId);
      setSuccessMessage('Prescription deleted successfully');
      if (selectedPatient) {
        await fetchPrescriptions(selectedPatient.customer.id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete prescription');
    }
  };

  const fetchBlockedSlots = async () => {
    if (!selectedDate || !user?.id) return;
    
    try {
      const startDate = format(selectedDate, 'yyyy-MM-dd');
      const endDate = format(addDays(selectedDate, 1), 'yyyy-MM-dd');
      const response = await appointmentApi.getBlockedSlots(
        user.id.toString(),
        startDate,
        endDate
      );
      setBlockedSlots(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching blocked slots:', error);
      setBlockedSlots([]);
    }
  };

  const handleBlockTime = async () => {
    if (!selectedDate || !user?.id) {
      message.error('Please select a date and ensure you are logged in');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Authentication token not found');
        return;
      }

      // Convert time to 24-hour format for consistency
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':');
      const hour = period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : 
                  period === 'AM' && hours === '12' ? 0 : parseInt(hours);
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minutes}`;

      await appointmentApi.blockTimeSlot({
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: formattedTime,
        endTime: formattedTime,
        reason: blockReason,
        dentistId: user.id
      });
      
      setOpenBlockDialog(false);
      setBlockReason('');
      fetchBlockedSlots();
    } catch (error: any) {
      console.error('Error blocking time:', error);
      setError(error.response?.data?.message || 'Failed to block time slot');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockTime = async (slotId: string) => {
    try {
      await appointmentApi.unblockTimeSlot(slotId);
      fetchBlockedSlots();
    } catch (error: any) {
      console.error('Error unblocking time:', error);
      setError(error.response?.data?.message || 'Failed to unblock time slot');
    }
  };

  const isTimeSlotBlocked = (time: string): boolean => {
    if (!selectedDate) return false;

    // Convert time to 24-hour format for comparison
    const [timeStr, period] = time.split(' ');
    const [hours, minutes] = timeStr.split(':');
    const hour = period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : 
                period === 'AM' && hours === '12' ? 0 : parseInt(hours);
    const formattedTime = `${hour.toString().padStart(2, '0')}:${minutes}`;

    return blockedSlots.some(slot => 
      isSameDay(new Date(slot.date), selectedDate) &&
      slot.startTime === formattedTime
    );
  };

  const isTimeSlotBooked = (time: string): boolean => {
    if (!selectedDate) return false;

    return appointments.some(app => {
      const appointmentDate = new Date(app.appointmentDate);
      const formattedTime = format(appointmentDate, 'hh:mm a');
      return isSameDay(appointmentDate, selectedDate) && formattedTime === time;
    });
  };

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      await appointmentApi.updateAppointmentStatus(
        appointmentId,
        newStatus as 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
      );
      setSuccessMessage('Appointment status updated successfully');
      fetchAppointments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update appointment status');
    }
  };

  const getStatusChip = (status: string) => {
    const statusStyles = {
      CONFIRMED: { ...dashboardStyles.statusChip, ...dashboardStyles.statusConfirmed },
      PENDING: { ...dashboardStyles.statusChip, ...dashboardStyles.statusPending },
      CANCELLED: { ...dashboardStyles.statusChip, ...dashboardStyles.statusCancelled },
      COMPLETED: { ...dashboardStyles.statusChip, ...dashboardStyles.statusCompleted },
    };

    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        sx={statusStyles[status as keyof typeof statusStyles]}
      />
    );
  };

  const getStatusActions = (appointment: Appointment) => {
    switch (appointment.status) {
      case 'PENDING':
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleStatusChange(appointment.id, 'CONFIRMED')}
            >
              Confirm
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleStatusChange(appointment.id, 'CANCELLED')}
            >
              Cancel
            </Button>
          </Box>
        );
      case 'CONFIRMED':
        return (
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<DoneIcon />}
            onClick={() => handleStatusChange(appointment.id, 'COMPLETED')}
          >
            Mark Complete
          </Button>
        );
      default:
        return null;
    }
  };

  const handlePatientClick = (appointment: Appointment) => {
    setSelectedPatientDetails(appointment);
    setOpenPatientDialog(true);
  };

  const renderPatientsTab = () => {
    const confirmedPatients = appointments.filter(app => app.status === 'CONFIRMED');
    const completedPatients = appointments.filter(app => app.status === 'COMPLETED');

    // Filter patients based on search query
    const filteredPatients = appointments.filter(app => {
      const searchLower = searchQuery.toLowerCase();
      return (
        app.customer.name.toLowerCase().includes(searchLower) ||
        app.customer.email.toLowerCase().includes(searchLower)
      );
    });

    return (
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600} color="primary">
            Patient Management
          </Typography>
          <TextField
            placeholder="Search by patient name or phone number..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white',
                '&:hover': {
                  '& > fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    edge="end"
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* All Patients with Prescriptions */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" color="primary">
              All Patients and Prescriptions
            </Typography>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Appointment Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Prescriptions</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No patients found</TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((appointment) => {
                      const patientPrescriptions = prescriptions.filter(
                        p => p.patientId === appointment.customer.id
                      );
                      
                      return (
                        <TableRow 
                          key={appointment.id} 
                          hover 
                          onClick={() => handlePatientClick(appointment)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>{appointment.customer.name}</TableCell>
                          <TableCell>{appointment.customer.email}</TableCell>
                          <TableCell>{format(new Date(appointment.appointmentDate), 'MMM d, yyyy hh:mm a')}</TableCell>
                          <TableCell>{getStatusChip(appointment.status)}</TableCell>
                          <TableCell>
                            {patientPrescriptions.length === 0 ? (
                              <Typography variant="body2" color="text.secondary">
                                No prescriptions
                              </Typography>
                            ) : (
                              patientPrescriptions.map(prescription => (
                                <Box key={prescription.id} sx={{ mb: 1 }}>
                                  <Typography variant="body2">
                                    <strong>{prescription.medication}</strong> - {prescription.dosage}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {prescription.instructions}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeletePrescription(prescription.id);
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              ))
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              startIcon={<AddIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPatient(appointment);
                                setOpenPrescriptionDialog(true);
                              }}
                            >
                              Add Prescription
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Confirmed Patients Section */}
        {(patientFilter === 'all' || patientFilter === 'confirmed') && (
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h6" color="primary">
                Confirmed Patients
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Appointment Date</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {confirmedPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No confirmed patients found</TableCell>
                    </TableRow>
                  ) : (
                    confirmedPatients.map((appointment) => (
                      <TableRow 
                        key={appointment.id} 
                        hover 
                        onClick={() => setSelectedPatient(appointment)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{appointment.customer.name}</TableCell>
                        <TableCell>{appointment.customer.email}</TableCell>
                        <TableCell>{format(new Date(appointment.appointmentDate), 'MMM d, yyyy hh:mm a')}</TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPatient(appointment);
                              setOpenPrescriptionDialog(true);
                            }}
                          >
                            Add Prescription
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Completed Patients Section */}
        {(patientFilter === 'all' || patientFilter === 'completed') && (
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DoneIcon sx={{ color: 'info.main', mr: 1 }} />
              <Typography variant="h6" color="primary">
                Completed Patients
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Visit Date</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completedPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No completed patients found</TableCell>
                    </TableRow>
                  ) : (
                    completedPatients.map((appointment) => (
                      <TableRow 
                        key={appointment.id} 
                        hover
                        onClick={() => setSelectedPatient(appointment)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{appointment.customer.name}</TableCell>
                        <TableCell>{appointment.customer.email}</TableCell>
                        <TableCell>{format(new Date(appointment.appointmentDate), 'MMM d, yyyy hh:mm a')}</TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell align="right">
                          {/* Removed the View/Add Prescription button */}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    );
  };

  const handleDownloadReport = () => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    
    const monthlyAppointments = appointments.filter(app => {
      const appDate = new Date(app.appointmentDate);
      return appDate >= monthStart && appDate <= monthEnd;
    });

    const monthlyPrescriptions = prescriptions.filter(pres => {
      const presDate = new Date(pres.createdAt);
      return presDate >= monthStart && presDate <= monthEnd;
    });

    return (
      <PDFDownloadLink
        document={
          <MonthlyReportPDF
            appointments={monthlyAppointments}
            prescriptions={monthlyPrescriptions}
            month={format(selectedMonth, 'MMMM')}
            year={selectedMonth.getFullYear()}
          />
        }
        fileName={`monthly-report-${format(selectedMonth, 'yyyy-MM')}.pdf`}
      >
        {({ loading }) => (
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            disabled={loading}
          >
            {loading ? 'Generating PDF...' : 'Download Monthly Report'}
          </Button>
        )}
      </PDFDownloadLink>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 14, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, Dr. {user?.name}
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={dashboardStyles.statsCard}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EventIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {appointments.filter(a => a.status === 'PENDING').length}
                </Typography>
                <Typography color="text.secondary">Pending Appointments</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={dashboardStyles.statsCard}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {appointments.filter(a => a.status === 'CONFIRMED').length}
                </Typography>
                <Typography color="text.secondary">Confirmed Today</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={dashboardStyles.statsCard}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PaymentIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {appointments.filter(a => a.status === 'COMPLETED').length}
                </Typography>
                <Typography color="text.secondary">Completed Today</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <DownloadIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
              Monthly Report
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
              Select a month and year to download a detailed PDF report of your appointments and prescriptions.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, width: '100%', justifyContent: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="month-label">Month</InputLabel>
                <Select
                  labelId="month-label"
                  value={selectedMonth.getMonth()}
                  label="Month"
                  onChange={e => {
                    const newDate = new Date(selectedMonth);
                    newDate.setMonth(Number(e.target.value));
                    setSelectedMonth(newDate);
                  }}
                >
                  {[...Array(12)].map((_, idx) => (
                    <MenuItem key={idx} value={idx}>{format(new Date(2000, idx, 1), 'MMMM')}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="year-label">Year</InputLabel>
                <Select
                  labelId="year-label"
                  value={selectedMonth.getFullYear()}
                  label="Year"
                  onChange={e => {
                    const newDate = new Date(selectedMonth);
                    newDate.setFullYear(Number(e.target.value));
                    setSelectedMonth(newDate);
                  }}
                >
                  {[...Array(6)].map((_, idx) => {
                    const year = new Date().getFullYear() - 2 + idx;
                    return <MenuItem key={year} value={year}>{year}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {handleDownloadReport()}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Appointments" />
          <Tab label="Patients" />
          <Tab label="Calendar" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 ? (
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
            Today's Appointments
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Symptoms</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">No appointments found</TableCell>
                  </TableRow>
                ) : (
                  appointments.map((appointment) => (
                    <TableRow key={appointment.id} hover>
                      <TableCell>
                        {format(new Date(appointment.appointmentDate), 'hh:mm a')}
                      </TableCell>
                      <TableCell>{appointment.customer.name}</TableCell>
                      <TableCell>{appointment.customer.email}</TableCell>
                      <TableCell>
                        {format(new Date(appointment.createdAt), 'PPp')}
                      </TableCell>
                      <TableCell>{appointment.reason}</TableCell>
                      <TableCell>
                        {appointment.symptoms && appointment.symptoms.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {appointment.symptoms.map(({ symptom }, index) => (
                              <Chip
                                key={index}
                                label={symptom.name}
                                size="small"
                                sx={{ m: 0.5 }}
                              />
                            ))}
                          </Box>
                        ) : (
                          'No symptoms reported'
                        )}
                      </TableCell>
                      <TableCell>{getStatusChip(appointment.status)}</TableCell>
                      <TableCell align="right">
                        {getStatusActions(appointment)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : activeTab === 1 ? (
        renderPatientsTab()
      ) : (
        <Grid container spacing={3}>
          {/* Calendar Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={dashboardStyles.statsCard}>
              <Typography variant="h6" sx={dashboardStyles.sectionTitle}>
                Calendar
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar
                  value={selectedDate}
                  onChange={(newDate) => {
                    setSelectedDate(newDate);
                    fetchBlockedSlots();
                  }}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Paper>
          </Grid>

          {/* Time Slots Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={dashboardStyles.statsCard}>
              <Typography variant="h6" sx={dashboardStyles.sectionTitle}>
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </Typography>
              <Grid container spacing={1}>
                {timeSlots.map((time) => {
                  const isBlocked = isTimeSlotBlocked(time);
                  const isBooked = isTimeSlotBooked(time);

                  return (
                    <Grid item xs={6} key={time}>
                      <Button
                        fullWidth
                        variant={isBooked ? "contained" : "outlined"}
                        color={isBooked ? "primary" : "inherit"}
                        disabled={isBlocked || isBooked}
                        onClick={() => {
                          if (!isBlocked && !isBooked) {
                            setSelectedTime(time);
                            setOpenBlockDialog(true);
                          }
                        }}
                        sx={{
                          mb: 1,
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          ...(isBooked && {
                            backgroundColor: '#1565c0',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#0d47a1',
                            },
                          }),
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Typography variant="body2">{time}</Typography>
                          {isBooked && (
                            <Box sx={{ ml: 'auto' }}>
                              {getStatusChip('CONFIRMED')}
                            </Box>
                          )}
                        </Box>
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Block Time Dialog */}
      <Dialog open={openBlockDialog} onClose={() => setOpenBlockDialog(false)}>
        <DialogTitle>Block Time Slot</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {selectedDate && format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}
            </Typography>
            <TextField
              fullWidth
              label="Reason (optional)"
              multiline
              rows={3}
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBlockDialog(false)}>Cancel</Button>
          <Button onClick={handleBlockTime} variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Prescription Dialog */}
      <Dialog open={openPrescriptionDialog} onClose={() => setOpenPrescriptionDialog(false)}>
        <DialogTitle>Add Prescription</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Treatment"
              value={prescriptionForm.medication}
              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medication: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={prescriptionForm.dosage}
              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Instructions"
              multiline
              rows={3}
              value={prescriptionForm.instructions}
              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPrescriptionDialog(false)}>Cancel</Button>
          <Button onClick={handleAddPrescription} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Patient Details Dialog */}
      <Dialog 
        open={openPatientDialog} 
        onClose={() => setOpenPatientDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            <Typography variant="h6">Patient Details</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPatientDetails && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                {/* Patient Information */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          <strong>Name:</strong> {selectedPatientDetails.customer.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          <strong>Email:</strong> {selectedPatientDetails.customer.email}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Appointment Details */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Appointment Details</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          <strong>Date:</strong> {format(new Date(selectedPatientDetails.appointmentDate), 'MMM d, yyyy hh:mm a')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          <strong>Status:</strong> {getStatusChip(selectedPatientDetails.status)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body1">
                          <strong>Reason:</strong> {selectedPatientDetails.reason}
                        </Typography>
                      </Grid>
                      {selectedPatientDetails.symptoms && selectedPatientDetails.symptoms.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="body1" gutterBottom>
                            <strong>Symptoms:</strong>
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedPatientDetails.symptoms.map(({ symptom }, index) => (
                              <Chip
                                key={index}
                                label={symptom.name}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Prescriptions */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Prescriptions</Typography>
                    {prescriptions.filter(p => p.patientId === selectedPatientDetails.customer.id).length === 0 ? (
                      <Typography color="text.secondary">No prescriptions found</Typography>
                    ) : (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Treatment</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>Instructions</TableCell>
                              <TableCell>Date</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {prescriptions
                              .filter(p => p.patientId === selectedPatientDetails.customer.id)
                              .map((prescription) => (
                                <TableRow key={prescription.id}>
                                  <TableCell>{prescription.medication}</TableCell>
                                  <TableCell>{prescription.dosage}</TableCell>
                                  <TableCell>{prescription.instructions}</TableCell>
                                  <TableCell>{format(new Date(prescription.createdAt), 'MMM d, yyyy')}</TableCell>
                                  <TableCell align="right">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeletePrescription(prescription.id)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setOpenPatientDialog(false);
                          setSelectedPatient(selectedPatientDetails);
                          setOpenPrescriptionDialog(true);
                        }}
                      >
                        Add Prescription
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPatientDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={!!error || !!successMessage}
        autoHideDuration={6000}
        onClose={() => {
          setError(null);
          setSuccessMessage(null);
        }}
      >
        <Alert
          onClose={() => {
            setError(null);
            setSuccessMessage(null);
          }}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DentistDashboard;
