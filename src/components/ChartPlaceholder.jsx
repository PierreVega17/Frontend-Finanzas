import React from 'react';
import { Box, Skeleton } from '@mui/material';

export default function ChartPlaceholder() {
  
  return (
    <Box 
      sx={{
        width: '100%',
        height: 400,
        p: 3,
        borderRadius: 2,
        backgroundColor: 'var(--paper-bg)'
      }}
    >
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={30} 
        sx={{ 
          bgcolor: 'var(--menu-item-hover)',
          mb: 2 
        }} 
      />
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-end',
        height: 300,
        gap: 2
      }}>
        {[60, 40, 80, 30, 90].map((height, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={40}
            height={`${height}%`}
            sx={{
              bgcolor: index % 2 === 0 
                ? 'var(--primary)' 
                : 'var(--secondary)',
              opacity: 0.7,
              borderRadius: '4px 4px 0 0'
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
