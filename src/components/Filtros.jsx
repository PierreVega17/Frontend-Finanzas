import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack
} from '@mui/material';
import { NotificationsActive } from '@mui/icons-material';

const currentYear = new Date().getFullYear();
const yearsRange = Array.from({ length: 10 }, (_, i) => currentYear - i);

const months = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

export default function Filtros({
  yearFilter,
  monthFilter,
  setYearFilter,
  setMonthFilter,
  onConfigureAlerts
}) {
  const handleMonthChange = (event) => {
    const value = event.target.value;
    setMonthFilter(value === '' ? null : value);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      mb: 4,
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'stretch', sm: 'center' },
      justifyContent: 'space-between'
    }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ flex: 1 }}
      >
        <FormControl 
          sx={{ 
            minWidth: 120,
            '& .MuiInputLabel-root': {
              color: 'var(--input-label)',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'var(--input-border)',
              },
              '&:hover fieldset': {
                borderColor: 'var(--input-hover-border)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'var(--input-focus-border)',
              },
              color: 'var(--input-text)',
            },
            '& .MuiSvgIcon-root': {
              color: 'var(--input-icon)',
            },
          }}
        >
          <InputLabel>Año</InputLabel>
          <Select
            value={yearFilter}
            label="Año"
            onChange={(e) => setYearFilter(e.target.value)}
          >
            {yearsRange.map(year => (
              <MenuItem 
                key={year} 
                value={year}
                sx={{
                  backgroundColor: 'var(--menu-item-bg)',
                  color: 'var(--menu-item-text)',
                  '&:hover': {
                    backgroundColor: 'var(--menu-item-hover)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'var(--menu-item-selected)',
                  },
                }}
              >
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl 
          sx={{ 
            minWidth: 140,
            '& .MuiInputLabel-root': {
              color: 'var(--input-label)',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'var(--input-border)',
              },
              '&:hover fieldset': {
                borderColor: 'var(--input-hover-border)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'var(--input-focus-border)',
              },
              color: 'var(--input-text)',
            },
            '& .MuiSvgIcon-root': {
              color: 'var(--input-icon)',
            },
          }}
        >
          <InputLabel shrink>Mes</InputLabel>
          <Select
            value={monthFilter || ''}
            label="Mes"
            onChange={handleMonthChange}
            displayEmpty
          >
            <MenuItem 
              value=""
              sx={{
                backgroundColor: 'var(--menu-item-bg)',
                color: 'var(--menu-item-text)',
                '&:hover': {
                  backgroundColor: 'var(--menu-item-hover)',
                },
              }}
            >
              Todos
            </MenuItem>
            {months.map(m => (
              <MenuItem 
                key={m.value} 
                value={m.value}
                sx={{
                  backgroundColor: 'var(--menu-item-bg)',
                  color: 'var(--menu-item-text)',
                  '&:hover': {
                    backgroundColor: 'var(--menu-item-hover)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'var(--menu-item-selected)',
                  },
                }}
              >
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Button
        variant="outlined"
        startIcon={<NotificationsActive />}
        onClick={onConfigureAlerts}
        sx={{
          minWidth: { xs: '100%', sm: 'auto' },
          whiteSpace: 'nowrap'
        }}
      >
        Configurar Alertas
      </Button>
    </Box>
  );
}
