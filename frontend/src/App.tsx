import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import CustomerDashboard from './components/dashboard/CustomerDashboard';
import DentistDashboard from './components/dashboard/DentistDashboard';
import ReceptionistDashboard from './components/dashboard/ReceptionistDashboard';
import MainDoctorDashboard from './components/dashboard/MainDoctorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import { AuthProvider } from './context/AuthContext';
import PatientProfile from './components/patients/PatientProfile';
import UserDetails from './pages/UserDetails';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0',
    },
    secondary: {
      main: '#42a5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, pt: '64px' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['CUSTOMER']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dentist-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['DENTIST']}>
                      <DentistDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/receptionist-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
                      <ReceptionistDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/main-doctor-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['MAIN_DOCTOR']}>
                      <MainDoctorDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />

                <Route path="/patients/:patientId" element={<PatientProfile />} />
                <Route path="/users/:id" element={<UserDetails />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 
