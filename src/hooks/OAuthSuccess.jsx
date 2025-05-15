import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, CircularProgress } from '@mui/material';
import useAuthStore from '../store/authStore.js';

export default function OAuthSuccess() {
  const setToken = useAuthStore(state => state.setToken);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      setToken(token);
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [location, setToken, navigate]);

  return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Procesando autenticación...
      </Typography>
      <CircularProgress />
    </Container>
  );
}