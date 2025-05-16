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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Person as PersonIcon, Group as GroupIcon, Event as EventIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { dashboardStyles } from './DashboardStyles';
import { authApi } from '../../services/api';
import { message } from 'antd';

export default function MainDoctorDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    specialization?: string;
    licenseNumber?: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    specialization: '',
    licenseNumber: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string; role: string } | null>(null);

  const roles = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'DENTIST', label: 'Dentist' },
    { value: 'RECEPTIONIST', label: 'Receptionist' },
    { value: 'CUSTOMER', label: 'Customer' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authApi.getAllUsers();
      setUsers(response);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.createUser(formData);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: '',
        specialization: '',
        licenseNumber: '',
      });
      fetchUsers();
    } catch (err) {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: { id: number; name: string; role: string }) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      await authApi.deleteUser(userToDelete.id);
      setSuccessMessage(`${userToDelete.role} ${userToDelete.name} deleted successfully`);
      fetchUsers(); // Refresh the user list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Premium stats (example, you can fetch real stats from backend)
  const stats = [
    {
      icon: <PersonIcon fontSize="large" color="primary" />,
      number: users.length,
      label: 'Total Users',
    },
    {
      icon: <GroupIcon fontSize="large" color="secondary" />,
      number: users.filter(u => u.role === 'DENTIST').length,
      label: 'Dentists',
    },
    {
      icon: <EventIcon fontSize="large" color="action" />,
      number: 0, // Replace with real appointment count
      label: 'Appointments',
    },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
      py: 6,
    }}>
      <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3, textAlign: 'center', p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  {stat.icon}
                  <Typography variant="h4" color="primary" fontWeight={700}>{stat.number}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">{stat.label}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* Welcome Card */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3, p: 3, background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)', color: 'white' }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome, Dr. {user?.name}!
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.9)">
            Manage your clinic, staff, and patients with premium tools.
          </Typography>
        </Card>
        {/* Create User Form */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
            Create New User
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Box component="form" onSubmit={handleCreateUser} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              variant="outlined"
              sx={{ flex: '1 1 200px', background: 'white', borderRadius: 2 }}
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
              variant="outlined"
              sx={{ flex: '1 1 200px', background: 'white', borderRadius: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              variant="outlined"
              sx={{ flex: '1 1 200px', background: 'white', borderRadius: 2 }}
            />
            <FormControl required sx={{ flex: '1 1 200px', background: 'white', borderRadius: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
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
              disabled={loading || !formData.name || !formData.email || !formData.password || !formData.role}
              sx={{ alignSelf: 'flex-end', minWidth: 150, fontWeight: 600, fontSize: 16 }}
            >
              {loading ? 'Creating...' : 'Create User'}
            </Button>
          </Box>
        </Paper>
        {/* User Details Table */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
            All Users
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No users found</TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} hover sx={{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 2 } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ bgcolor: '#1565c0', width: 32, height: 32, fontWeight: 700 }}>
                            {user.name.charAt(0)}
                          </Avatar>
                          <Typography fontWeight={600}>{user.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={
                            user.role === 'ADMIN' || user.role === 'MAIN_DOCTOR'
                              ? 'primary'
                              : user.role === 'DENTIST'
                              ? 'secondary'
                              : 'default'
                          }
                          size="small"
                          sx={{ fontWeight: 600, letterSpacing: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(user)}
                          disabled={loading}
                        >
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Confirm Delete User
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete {userToDelete?.role} {userToDelete?.name}? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notifications */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="error" onClose={() => setError('')}>
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
    </Box>
  );
} 
