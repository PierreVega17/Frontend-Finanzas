import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert, 
  CircularProgress, 
  FormControlLabel,
  Checkbox 
} from '@mui/material';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import useAuthStore from '../store/authStore';
import api from '../utils/Api'; // Usar la instancia de axios configurada

export default function Login() {
  const { setToken, setRefreshToken } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      // Guardar ambos tokens
      setToken(response.data.accessToken, rememberMe);
      setRefreshToken(response.data.refreshToken);
      
      // Redirigir al dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Error en login:', err);
      
      // Manejo mejorado de errores
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.message || 
                         'Error al iniciar sesión. Intente nuevamente.';
      
      setError(errorMessage);
      
      // Limpiar tokens si hay error 401
      if (err.response?.status === 401) {
        useAuthStore.getState().clearToken();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRedirect = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/oauth/${provider}`;
  };

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--color)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <Box 
        sx={{ 
          maxWidth: 400,
          p: 4,
          backgroundColor: 'var(--input-bg)',
          borderRadius: 2,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            autoFocus
            InputProps={{
              style: { color: 'var(--input-color)' },
            }}
            InputLabelProps={{
              style: { color: 'var(--color)' },
            }}
            sx={{
              backgroundColor: 'var(--input-bg)',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'var(--color)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--color)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--color)',
                },
              },
            }}
          />
          <TextField
            margin="normal"
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
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
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'var(--color)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--color)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--color)',
                },
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                sx={{ 
                  color: 'var(--color)',
                  '&.Mui-checked': {
                    color: 'var(--primary)',
                  }
                }} 
              />
            }
            label="Acuérdate de mí"
            sx={{ 
              color: 'var(--color)',
              mt: 1,
              '& .MuiTypography-root': {
                color: 'var(--color)',
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
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
            {loading ? <CircularProgress size={24} sx={{ color: 'var(--btn-color)' }} /> : 'Entrar'}
          </Button>
        </form>

        <Box sx={{ mt: 3 }}>
          <Typography align="center" variant="body1" sx={{ color: 'var(--color)' }}>
            O
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleOAuthRedirect('github')}
              sx={{
                textTransform: 'none',
                backgroundColor: '#333',
                color: '#fff',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                '&:hover': {
                  backgroundColor: '#444',
                },
              }}
            >
              <FaGithub size={20} /> Iniciar Sesión Con GitHub
            </Button>
            <Button
              variant="contained"
              onClick={() => handleOAuthRedirect('google')}
              sx={{
                textTransform: 'none',
                backgroundColor: '#db4437',
                color: '#fff',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                '&:hover': {
                  backgroundColor: '#c33c2e',
                },
              }}
            >
              <FaGoogle size={20} /> Iniciar Sesión Con Google
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
