import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import { CircularProgress, Box } from '@mui/material';
import { useMemo } from 'react';

export function PrivateRoute({ children }) {
  const location = useLocation();
  
  // Usar selectores individuales para evitar recreaciones innecesarias
  const token = useAuthStore(state => state.token);
  const isInitialized = useAuthStore(state => state.isInitialized);

  // Memorizar el componente de carga
  const loadingComponent = useMemo(() => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <CircularProgress />
    </Box>
  ), []);

  if (!isInitialized) {
    return loadingComponent;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}