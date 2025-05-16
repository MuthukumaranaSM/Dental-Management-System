import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Payment as PaymentIcon,
  LocalHospital as HospitalIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { dashboardStyles } from './DashboardStyles';
import { authApi } from '../../services/api';
import { message } from 'antd';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  specialization?: string;
  licenseNumber?: string;
  shift?: string;
}

const AdminDashboard = () => {
  const { user } = useAuth() as { user: User | null };
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    specialization: '',
    licenseNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDentists: 0,
    totalAppointments: 0,
  });

  const roles = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'DENTIST', label: 'Dentist' },
    { value: 'RECEPTIONIST', label: 'Receptionist' },
    { value: 'CUSTOMER', label: 'Customer' },
  ];

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUserError(null);
    try {
      const response = await authApi.getAllUsers();
      setUsers(response);
    } catch (error: any) {
      setUserError(error.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchStats = async () => {
    // TODO: Implement stats fetching from API
    setStats({
      totalUsers: users.length,
      totalDentists: users.filter(u => u.role === 'DENTIST').length,
      totalAppointments: 0, // This should come from appointments API
    });
  };

  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      patientName: 'John Doe',
      date: '2024-05-10',
      time: '10:00 AM',
      service: 'Dental Cleaning',
      status: 'confirmed',
      doctor: 'Dr. Smith',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      date: '2024-05-10',
      time: '11:30 AM',
      service: 'Root Canal',
      status: 'pending',
      doctor: 'Dr. Johnson',
    },
    {
      id: 3,
      patientName: 'Mike Johnson',
      date: '2024-05-11',
      time: '2:00 PM',
      service: 'Teeth Whitening',
      status: 'confirmed',
      doctor: 'Dr. Smith',
    },
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleCreateUser = async () => {
    setLoading(true);
    setError(null);
    try {
      await authApi.createUser(newUser);
      setOpenUserModal(false);
      // Reset form
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: '',
        specialization: '',
        licenseNumber: '',
      });
      fetchUsers();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status: string) => {
    const statusStyles = {
      confirmed: { ...dashboardStyles.statusChip, ...dashboardStyles.statusConfirmed },
      pending: { ...dashboardStyles.statusChip, ...dashboardStyles.statusPending },
      cancelled: { ...dashboardStyles.statusChip, ...dashboardStyles.statusCancelled },
    };

    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        sx={statusStyles[status as keyof typeof statusStyles]}
      />
    );
  };

  const CreateUserModal = () => (
    <Dialog open={openUserModal} onClose={() => setOpenUserModal(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              onChange={(e: SelectChangeEvent) => setNewUser({ ...newUser, role: e.target.value })}
              label="Role"
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenUserModal(false)}>Cancel</Button>
        <Button
          onClick={handleCreateUser}
          variant="contained"
          disabled={loading || !newUser.name || !newUser.email || !newUser.password || !newUser.role}
        >
          {loading ? 'Creating...' : 'Create User'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const StatCard = ({ title, value, icon }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" color="primary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={dashboardStyles.container}>
      {/* Create New User Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Create New User
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={e => { e.preventDefault(); handleCreateUser(); }} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Name"
            value={newUser.name}
            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            required
            sx={{ flex: '1 1 200px' }}
          />
          <TextField
            label="Email"
            type="email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            required
            sx={{ flex: '1 1 200px' }}
          />
          <TextField
            label="Password"
            type="password"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            required
            sx={{ flex: '1 1 200px' }}
          />
          <FormControl required sx={{ flex: '1 1 200px' }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value })}
              label="Role"
            >
              {roles.map(role => (
                <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !newUser.name || !newUser.email || !newUser.password || !newUser.role}
            sx={{ alignSelf: 'flex-end', minWidth: 150 }}
          >
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </Box>
      </Paper>

      {/* Welcome Section */}
      <Paper sx={dashboardStyles.welcomeCard}>
        <Box sx={dashboardStyles.profileSection}>
          <Avatar sx={dashboardStyles.profileAvatar}>
            {user?.name?.charAt(0) || 'A'}
          </Avatar>
          <Box sx={dashboardStyles.profileInfo}>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.name}!
            </Typography>
            <Typography variant="body1">
              Here's what's happening at your dental clinic today.
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={handleNotificationClick}
              sx={dashboardStyles.notificationBadge}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Stats Section */}
      <Grid container spacing={3} sx={dashboardStyles.gridContainer}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PersonIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Dentists"
            value={stats.totalDentists}
            icon={<GroupIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<EventIcon color="primary" />}
          />
        </Grid>
      </Grid>

      {/* Users Management Section */}
      <Paper sx={{ ...dashboardStyles.appointmentCard, mt: 3 }}>
        <Box sx={dashboardStyles.appointmentHeader}>
          <Typography variant="h6" sx={dashboardStyles.sectionTitle}>
            User Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Create User
            </Button>
          </Box>
        </Box>

        {userError && (
          <Typography color="error" sx={{ mb: 2, p: 2 }}>
            {userError}
          </Typography>
        )}

        <TableContainer>
          <Table>
            <TableHead sx={dashboardStyles.tableHeader}>
              <TableRow>
                <TableCell sx={dashboardStyles.tableHeader}>Name</TableCell>
                <TableCell sx={dashboardStyles.tableHeader}>Email</TableCell>
                <TableCell sx={dashboardStyles.tableHeader}>Role</TableCell>
                <TableCell sx={dashboardStyles.tableHeader}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingUsers ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">Loading users...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No users found</TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} sx={dashboardStyles.tableRow}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        {user.name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={
                          user.role === 'MAIN_DOCTOR'
                            ? 'primary'
                            : user.role === 'DENTIST'
                            ? 'secondary'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Appointments Section */}
      <Paper sx={dashboardStyles.appointmentCard}>
        <Box sx={dashboardStyles.appointmentHeader}>
          <Typography variant="h6" sx={dashboardStyles.sectionTitle}>
            Today's Appointments
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search appointments..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={dashboardStyles.searchBar}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              sx={dashboardStyles.secondaryButton}
            >
              Filter
            </Button>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={dashboardStyles.tableHeader}>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id} sx={dashboardStyles.tableRow}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {appointment.patientName.charAt(0)}
                      </Avatar>
                      {appointment.patientName}
                    </Box>
                  </TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{getStatusChip(appointment.status)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={dashboardStyles.statsCard}>
            <Typography variant="h6" sx={dashboardStyles.sectionTitle}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PersonIcon />}
                  onClick={() => setOpenDialog(true)}
                  sx={dashboardStyles.actionButton}
                >
                  Create User
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EventIcon />}
                  sx={dashboardStyles.secondaryButton}
                >
                  Schedule
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PaymentIcon />}
                  sx={dashboardStyles.secondaryButton}
                >
                  Billing
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<HospitalIcon />}
                  sx={dashboardStyles.secondaryButton}
                >
                  Reports
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={dashboardStyles.statsCard}>
            <Typography variant="h6" sx={dashboardStyles.sectionTitle}>
              Recent Activity
            </Typography>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                • New patient registration: John Smith
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                • Appointment confirmed: Dental Cleaning
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                • Payment received: $200
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <CreateUserModal />

      {/* Menus */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={dashboardStyles.menuItem}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        sx={dashboardStyles.menuItem}
      >
        <MenuItem onClick={handleNotificationClose}>
          New appointment request from Jane Smith
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          Payment received from Mike Johnson
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          System maintenance scheduled
        </MenuItem>
      </Menu>

      {/* Create User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                onChange={(e: SelectChangeEvent) => setNewUser({ ...newUser, role: e.target.value })}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
