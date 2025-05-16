import { SxProps, Theme } from '@mui/material';

export const dashboardStyles: Record<string, SxProps<Theme>> = {
  container: {
    mt: 14,
    mb: 4,
    px: { xs: 2, sm: 3 },
  },
  welcomeCard: {
    p: 3,
    mb: 3,
    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
    color: 'white',
    borderRadius: 2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  gridContainer: {
    mb: 3,
  },
  statsCard: {
    p: 3,
    height: '100%',
    borderRadius: 2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  statsIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: 'rgba(21, 101, 192, 0.1)',
    color: '#1565c0',
    margin: '0 auto 16px',
  },
  statsNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1565c0',
    mb: 1,
  },
  statsLabel: {
    color: 'text.secondary',
    fontSize: '0.9rem',
  },
  appointmentCard: {
    p: 3,
    borderRadius: 2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  appointmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1565c0',
    mb: 2,
  },
  appointmentList: {
    '& .MuiListItem-root': {
      px: 0,
    },
  },
  appointmentItem: {
    py: 2,
  },
  actionButton: {
    backgroundColor: '#1565c0',
    color: 'white',
    '&:hover': {
      backgroundColor: '#0d47a1',
    },
  },
  secondaryButton: {
    borderColor: '#1565c0',
    color: '#1565c0',
    '&:hover': {
      borderColor: '#0d47a1',
      backgroundColor: 'rgba(21, 101, 192, 0.04)',
    },
  },
  statusChip: {
    borderRadius: '16px',
    fontWeight: 'medium',
  },
  statusConfirmed: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  statusPending: {
    backgroundColor: '#fff3e0',
    color: '#ef6c00',
  },
  statusCancelled: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  tableContainer: {
    mt: 3,
    borderRadius: 2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    '& .MuiTableCell-head': {
      fontWeight: 'bold',
      color: '#1565c0',
    },
  },
  tableRow: {
    '&:hover': {
      backgroundColor: 'rgba(21, 101, 192, 0.04)',
    },
  },
  searchBar: {
    mb: 3,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
    },
  },
  filterChip: {
    m: 0.5,
  },
  chartContainer: {
    p: 3,
    borderRadius: 2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    height: '100%',
  },
  notificationBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#f44336',
    },
  },
  menuItem: {
    '&:hover': {
      backgroundColor: 'rgba(21, 101, 192, 0.04)',
    },
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 3,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    border: '3px solid #1565c0',
  },
  profileInfo: {
    '& .MuiTypography-h6': {
      color: '#1565c0',
      fontWeight: 'bold',
    },
  },
}; 
