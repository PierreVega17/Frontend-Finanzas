import { useState } from 'react';
import { 
  Grid, 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import useThemeStore from '../store/themeStore';

export default function MovementForm({ onSubmit }) {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [currency, setCurrency] = useState('$'); // Dólar por defecto
  const isDarkMode = useThemeStore(state => state.isDarkMode);

  const currencies = [
    { symbol: '$', name: 'Dólar' },
    { symbol: 'S/', name: 'Sol' },
    { symbol: '€', name: 'Euro' },
    { symbol: '£', name: 'Libra' },
    { symbol: 'R$', name: 'Real' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const movement = {
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
      currency
    };
    
    await onSubmit(movement);
    
    // Limpiar el formulario
    setType('income');
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        mb: 4,
        p: 3,
        backgroundColor: 'var(--input-bg)',
        borderRadius: 2,
        boxShadow: 3,
        '& .MuiFormControl-root': {
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
        }
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="type-label">Tipo</InputLabel>
            <Select
              labelId="type-label"
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Tipo"
            >
              <MenuItem value="income">Ingreso</MenuItem>
              <MenuItem value="expense">Egreso</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Monto"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="currency-label">Moneda</InputLabel>
            <Select
              labelId="currency-label"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              label="Moneda"
            >
              {currencies.map((curr) => (
                <MenuItem key={curr.symbol} value={curr.symbol} title={curr.name}>
                  {curr.symbol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Fecha"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: 'var(--btn-bg)',
              color: 'var(--btn-color)',
              '&:hover': {
                backgroundColor: 'var(--btn-hover-bg)',
              }
            }}
          >
            Agregar Movimiento
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

