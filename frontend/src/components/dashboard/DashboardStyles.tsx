export const dashboardStyles = {  container: {
    paddingTop: '84px',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    maxWidth: '1600px !important', // Increase maximum width
  },
  welcomeCard: {
    p: 3,
    mb: 3,
    borderRadius: 2,
  },
  statsCard: {
    p: 3,
    height: '100%',
    borderRadius: 2,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },  actionButton: {
    textTransform: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontWeight: 600,
    minWidth: '110px',
    padding: '8px 16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
    '&:active': {
      transform: 'translateY(1px)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    },
  },
  confirmButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#43a047',
    },
  },
  cancelButton: {
    borderColor: '#ef5350',
    color: '#ef5350',
    '&:hover': {
      backgroundColor: 'rgba(239, 83, 80, 0.08)',
      borderColor: '#e53935',
      color: '#e53935',
    },
  },
  statusChip: {
    borderRadius: 1,
    fontSize: '0.85rem',
    fontWeight: 500,
  },
  statusPending: {
    backgroundColor: '#fff3e0',
    color: '#e65100',
  },
  statusConfirmed: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  statusCancelled: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  statusCompleted: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
  },  tableHeader: {
    backgroundColor: '#f5f5f5',
    '& th': {
      fontWeight: 600,
      whiteSpace: 'nowrap',
      padding: '16px',
    },
  },
  tableCell: {
    padding: '16px',
    '&:first-of-type': {
      minWidth: '180px', // Date & Time column
    },
    '&:nth-of-type(2)': {
      minWidth: '150px', // Patient Name column
    },
    '&:nth-of-type(3)': {
      minWidth: '200px', // Patient Email column
    },
    '&:nth-of-type(4)': {
      minWidth: '150px', // Dentist column
    },
    '&:nth-of-type(5)': {
      minWidth: '150px', // Reason column
    },
    '&:nth-of-type(6)': {
      minWidth: '120px', // Status column
    },
  },
  tableContainer: {
    overflowX: 'auto',
    width: '100%',
    '& .MuiTable-root': {
      minWidth: '1200px', // Minimum table width
    },
  },
  tableCellActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 1,
    minWidth: '200px',
    padding: '8px 16px',
  },  actionsContainer: {
    display: 'flex',
    gap: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '4px 0',
    '& .MuiButton-root': {
      minWidth: '110px',
    },
  },  tableCellActions: {
    minWidth: '250px', // Increased to accommodate both buttons
    padding: '12px 24px',
  },
  appointmentTable: {
    '& .MuiTableCell-root': {
      padding: '16px',
    },
    '& .MuiTableCell-head': {
      backgroundColor: '#f5f5f5',
      fontWeight: 600,
    },
    '& .MuiTableRow-root:hover': {
      backgroundColor: '#f8f9fa',
    },
    '& .MuiTableCell-body': {
      '&:nth-of-type(1)': { minWidth: '180px' }, // Date & Time
      '&:nth-of-type(2)': { minWidth: '150px' }, // Patient Name
      '&:nth-of-type(3)': { minWidth: '220px' }, // Patient Email
      '&:nth-of-type(4)': { minWidth: '150px' }, // Dentist
      '&:nth-of-type(5)': { minWidth: '150px' }, // Reason
      '&:nth-of-type(6)': { minWidth: '120px' }, // Status
      '&:nth-of-type(7)': { minWidth: '250px' }, // Actions
    },
  },
};
};
