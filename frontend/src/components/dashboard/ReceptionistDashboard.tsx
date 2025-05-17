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
  Grid,
  Chip,
  Stack,
  Avatar,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import { appointmentApi, authApi } from '../../services/api';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { dashboardStyles } from './DashboardStyles';
import {
  Event as EventIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Done as DoneIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import CreateCustomerModal from '../CreateCustomerModal';
import { GenerateBillModal } from '../GenerateBillModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface Appointment {
  id: number;
  appointmentDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  reason: string;
  createdAt: string;
  symptoms: string[];
  customer: {
    name: string;
    email: string;
  };
  dentist: {
    name: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  specialization?: string;
  licenseNumber?: string;
  shift?: string;
}

export default function ReceptionistDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] = useState(false);
  const [isGenerateBillModalOpen, setIsGenerateBillModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const data = await appointmentApi.getReceptionistAppointments();
      console.log('Fetched appointments:', data);
      setAppointments(data);
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await authApi.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchUsers();
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

  const handleGenerateBill = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsGenerateBillModalOpen(true);
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
    switch (appointment.status) {      case 'PENDING':
        return (
          <Stack direction="row" spacing={2}>
            <Button
              size="medium"
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleStatusChange(appointment.id, 'CONFIRMED')}
              sx={{ 
                ...dashboardStyles.actionButton,
                ...dashboardStyles.confirmButton
              }}
            >
              Confirm
            </Button>
            <Button
              size="medium"
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => handleStatusChange(appointment.id, 'CANCELLED')}
              sx={{ 
                ...dashboardStyles.actionButton,
                ...dashboardStyles.cancelButton
              }}
            >
              Cancel
            </Button>
          </Stack>
        );
      case 'CONFIRMED':
        return (
          <Button
            size="medium"
            variant="contained"
            color="primary"
            startIcon={<DoneIcon />}
            onClick={() => handleStatusChange(appointment.id, 'COMPLETED')}
            sx={{ ...dashboardStyles.actionButton }}
          >
            Mark Complete
          </Button>
        );
      case 'COMPLETED':
        return (
          <Button
            size="medium"
            variant="contained"
            color="primary"
            startIcon={<DoneIcon />}
            onClick={() => handleGenerateBill(appointment)}
            sx={{ ...dashboardStyles.actionButton }}
          >
            Generate Bill
          </Button>
        );
      default:
        return null;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const search = appointmentSearch.toLowerCase();
    const matchesSearch =
      appointment.customer.name.toLowerCase().includes(search) ||
      appointment.customer.email.toLowerCase().includes(search) ||
      appointment.dentist.name.toLowerCase().includes(search) ||
      appointment.reason.toLowerCase().includes(search);
    return matchesStatus && (search === '' || matchesSearch);
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUserClick = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  const handleCreateCustomer = async (data: CreateCustomerFormData) => {
    try {
      await createCustomer(data);
      toast.success('Customer created successfully. A verification email has been sent to their email address.');
      setShowCreateCustomerModal(false);
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to create customer');
    }
  };

  return (
    <Container maxWidth={false} sx={{ 
      ...dashboardStyles.container,
      px: { xs: 2, sm: 3, md: 4 }  // Add responsive padding
    }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.name}
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
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
        <Grid item xs={12} md={3}>
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
        <Grid item xs={12} md={3}>
          <Paper sx={dashboardStyles.statsCard}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DoneIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {appointments.filter(a => a.status === 'COMPLETED').length}
                </Typography>
                <Typography color="text.secondary">Completed Today</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={dashboardStyles.statsCard}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <GroupIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {users.length}
                </Typography>
                <Typography color="text.secondary">Total Users</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs for Appointments and Users */}
      <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Appointments" />
          <Tab label="Users" />
        </Tabs>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {activeTab === 0 ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600} color="primary">
                  All Appointments
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    placeholder="Search appointments..."
                    value={appointmentSearch}
                    onChange={e => setAppointmentSearch(e.target.value)}
                    size="small"
                    sx={{ minWidth: 250 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setIsCreateCustomerModalOpen(true)}
                  >
                    Create Customer
                  </Button>
                  <FormControl sx={{ minWidth: 200 }}>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                      <MenuItem value="CANCELLED">Cancelled</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <TableContainer sx={{ 
                overflowX: 'auto',
                width: '100%',
                '& .MuiTable-root': {
                  minWidth: '1200px'
                }
              }}>
                <Table sx={dashboardStyles.appointmentTable}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Patient Name</TableCell>
                      <TableCell>Patient Email</TableCell>
                      <TableCell>Dentist</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Symptoms</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell sx={dashboardStyles.tableCellActions}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAppointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">No appointments found</TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.map((appointment) => (
                        <TableRow key={appointment.id} hover>
                          <TableCell sx={dashboardStyles.tableCell}>
                            {format(new Date(appointment.appointmentDate), 'PPp')}
                          </TableCell>
                          <TableCell sx={dashboardStyles.tableCell}>
                            {format(new Date(appointment.createdAt), 'PPp')}
                          </TableCell>
                          <TableCell sx={dashboardStyles.tableCell}>{appointment.customer.name}</TableCell>
                          <TableCell sx={dashboardStyles.tableCell}>{appointment.customer.email}</TableCell>
                          <TableCell sx={dashboardStyles.tableCell}>{appointment.dentist.name}</TableCell>
                          <TableCell sx={dashboardStyles.tableCell}>{appointment.reason}</TableCell>
                          <TableCell sx={dashboardStyles.tableCell}>
                            {appointment.symptoms?.length > 0 ? (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {appointment.symptoms.map((symptom, index) => (
                                  <Chip
                                    key={index}
                                    label={symptom}
                                    size="small"
                                    sx={{ m: 0.5 }}
                                  />
                                ))}
                              </Box>
                            ) : (
                              'No symptoms reported'
                            )}
                          </TableCell>
                          <TableCell sx={dashboardStyles.tableCell}>{getStatusChip(appointment.status)}</TableCell>
                          <TableCell sx={dashboardStyles.tableCellActions}>
                            <Box sx={dashboardStyles.actionsContainer}>
                              {getStatusActions(appointment)}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600} color="primary">
                  All Users
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    sx={{ minWidth: 250 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="all">All Roles</MenuItem>
                      <MenuItem value="DENTIST">Dentist</MenuItem>
                      <MenuItem value="RECEPTIONIST">Receptionist</MenuItem>
                      <MenuItem value="CUSTOMER">Customer</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Specialization/Shift</TableCell>
                      <TableCell>License Number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">No users found</TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          hover
                          onClick={() => handleUserClick(user.id)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{user.specialization || user.shift || '-'}</TableCell>
                          <TableCell>{user.licenseNumber || '-'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Paper>

      {/* Create Customer Modal */}
      <CreateCustomerModal
        open={isCreateCustomerModalOpen}
        onClose={() => setIsCreateCustomerModalOpen(false)}
        onSuccess={() => {
          setSuccessMessage('Customer created successfully');
          setIsCreateCustomerModalOpen(false);
        }}
      />

      {/* Generate Bill Modal */}
      {selectedAppointment && (
        <GenerateBillModal
          isOpen={isGenerateBillModalOpen}
          onClose={() => {
            setIsGenerateBillModalOpen(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
        />
      )}

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
