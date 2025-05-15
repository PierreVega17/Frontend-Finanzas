import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  CircularProgress 
} from '@mui/material';
import useAuthStore from '../store/authStore';
import api from '../utils/Api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, setRefreshToken } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/api/auth/register', {
        name: username,
        email,
        password
      });

      // Guardar tokens después del registro
      setToken(response.data.accessToken, true); // Siempre rememberMe en registro
      setRefreshToken(response.data.refreshToken);
      
      // Redirigir al dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Error en registro:', err);
      
      // Manejo detallado de errores
      let errorMessage = 'Error al registrar. Intente nuevamente.';
      
      if (err.response?.data?.errors?.length > 0) {
        errorMessage = err.response.data.errors[0].msg;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
    sx={{
        height: 'calc(100vh - 64px)',
        backgroundColor: 'var(--bg-color)', // Fondo dinámico
        color: 'var(--color)', // Texto dinámico
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        justifyItems: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          p: 4,
          backgroundColor: 'var(--input-bg)', // Fondo del formulario
          borderRadius: 2,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          color: 'var(--color)',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Registro
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre de usuario"
            type="text"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            InputProps={{
              style: { color: 'var(--input-color)' },
            }}
            InputLabelProps={{
              style: { color: 'var(--color)' },
            }}
            sx={{
              backgroundColor: 'var(--input-bg)',
              borderRadius: 1,
            }}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              style: { color: 'var(--input-color)' },
            }}
            InputLabelProps={{
              style: { color: 'var(--color)' },
            }}
            sx={{
              backgroundColor: 'var(--input-bg)',
              borderRadius: 1,
            }}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              style: { color: 'var(--input-color)' },
            }}
            InputLabelProps={{
              style: { color: 'var(--color)' },
            }}
            sx={{
              backgroundColor: 'var(--input-bg)',
              borderRadius: 1,
            }}
          />
          <TextField
            label="Confirmar contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            InputProps={{
              style: { color: 'var(--input-color)' },
            }}
            InputLabelProps={{
              style: { color: 'var(--color)' },
            }}
            sx={{
              backgroundColor: 'var(--input-bg)',
              borderRadius: 1,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: 'var(--btn-bg)',
              color: 'var(--btn-color)',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'var(--btn-hover-bg)',
              },
            }}
          >
            Registrarse
          </Button>
        </form>
      </Box>
    </Box>
  );
}
