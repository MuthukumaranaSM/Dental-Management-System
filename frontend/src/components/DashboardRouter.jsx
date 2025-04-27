import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import DentistDashboard from '../pages/dashboards/DentistDashboard';
import PatientDashboard from '../pages/dashboards/PatientDashboard';
import ReceptionistDashboard from '../pages/dashboards/ReceptionistDashboard';

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'DENTIST':
      return <DentistDashboard />;
    case 'PATIENT':
      return <PatientDashboard />;
    case 'RECEPTIONIST':
      return <ReceptionistDashboard />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default DashboardRouter;