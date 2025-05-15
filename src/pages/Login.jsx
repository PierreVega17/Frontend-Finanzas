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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function apiLogin(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    let message = 'Error en login';
    if (data?.errors?.length) message = data.errors[0].msg;
    else if (data?.error) message = data.error;
    throw new Error(message);
  }

  const data = await res.json();
  return data.token;
}

export default function Login() {
  const setToken = useAuthStore(state => state.setToken);
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
      const token = await apiLogin(email, password);
      setToken(token, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRedirect = (provider) => {
    window.open(`${API_BASE_URL}/api/oauth/${provider}`, '_self');
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
//prueba