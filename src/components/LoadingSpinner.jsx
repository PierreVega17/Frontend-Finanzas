import React from 'react';
import { CircularProgress, Box } from '@mui/material';

export default function LoadingSpinner({ size = 40, thickness = 4 }) {
  
  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-color)'
      }}
    >
      <CircularProgress
        size={size}
        thickness={thickness}
        sx={{
          color: 'var(--primary)',
          animationDuration: '800ms'
        }}
      />
    </Box>
  );
}
