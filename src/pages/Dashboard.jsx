import React, { useEffect, useState, lazy, Suspense, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Grid,
  Alert,
  Drawer,
  Snackbar
} from '@mui/material';
import MovementForm from '../components/MovementForm';
import MovementsList from '../components/MovementsList';
const IncomeExpenseChart = lazy(() => import('../components/IncomeExpenseChart'));
import Filtros from '../components/Filtros';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import ChartPlaceholder from '../components/ChartPlaceholder';
import AlertManager from '../components/AlertManager';
import { useNavigate } from 'react-router-dom';
import { movementsService } from '../services/movements';
import { alertsService } from '../services/alerts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = useAuthStore(state => state.token);
  const isInitialized = useAuthStore(state => state.isInitialized);
  const clearToken = useAuthStore(state => state.clearToken);
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [monthFilter, setMonthFilter] = useState(null);
  const [isAlertManagerOpen, setIsAlertManagerOpen] = useState(false);
  const [alertNotification, setAlertNotification] = useState(null);

  useEffect(() => {
    if (isInitialized && !token) {
      navigate('/login');
    }
  }, [isInitialized, token, navigate]);

  const handleAuthError = useCallback(() => {
    clearToken();
    navigate('/login');
  }, [clearToken, navigate]);

  const fetchMovements = useCallback(async () => {
    if (!token) {
      setError('No hay token de autenticación');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await movementsService.getMovements(yearFilter, monthFilter);
      setMovements(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching movements:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [token, yearFilter, monthFilter]);

  useEffect(() => {
    if (isInitialized && token) {
      fetchMovements();
    }
  }, [isInitialized, token, fetchMovements]);

  const checkAlerts = useCallback(async () => {
    if (!token) return;
    
    try {
      const data = await alertsService.checkAlerts();
      if (data.triggeredAlerts.length > 0) {
        setAlertNotification({
          message: `¡Se han activado ${data.triggeredAlerts.length} alertas! Total de gastos: ${data.triggeredAlerts[0].currency || '$'}${data.triggeredAlerts[0].totalExpenses.toFixed(2)}`,
          severity: 'warning'
        });
      }
    } catch (error) {
      console.error('Error al verificar alertas:', error);
    }
  }, [token]);

  const handleAddMovement = useCallback(async (movement) => {
    try {
      const newMovement = await movementsService.createMovement(movement);
      setMovements(prev => [...prev, newMovement]);
      setError(null);
      await fetchMovements();
      
      if (movement.type === 'expense') {
        await checkAlerts();
      }
    } catch (error) {
      console.error('Error adding movement:', error);
      setError(error.message);
    }
  }, [fetchMovements, checkAlerts]);

  const handleDeleteMovement = useCallback(async (id) => {
    try {
      await movementsService.deleteMovement(id);
      setMovements(prev => prev.filter(movement => movement._id !== id));
      setError(null);
      await fetchMovements();
    } catch (error) {
      console.error('Error deleting movement:', error);
      setError(error.message);
    }
  }, [fetchMovements]);

  const handleEditMovement = useCallback(async (id, updatedMovement) => {
    try {
      await movementsService.updateMovement(id, updatedMovement);
      await fetchMovements();
      if (updatedMovement.type === 'expense') {
        await checkAlerts();
          }
    } catch (error) {
      console.error('Error updating movement:', error);
      setError(error.message);
    }
  }, [fetchMovements, checkAlerts]);

  const toggleAlertManager = useCallback(() => {
    setIsAlertManagerOpen(prev => !prev);
  }, []);

  if (!isInitialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
      }

  if (!token) {
    return null; // El useEffect se encargará de la redirección
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <MovementForm onSubmit={handleAddMovement} />

      <Filtros
        yearFilter={yearFilter} 
        monthFilter={monthFilter} 
        setYearFilter={setYearFilter} 
        setMonthFilter={setMonthFilter} 
        onConfigureAlerts={toggleAlertManager}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <MovementsList
            movements={movements}
            onEdit={handleEditMovement}
            onDelete={handleDeleteMovement}
            onRefresh={fetchMovements}
          />
          
          <Suspense fallback={<ChartPlaceholder />}>
            <IncomeExpenseChart transactions={movements} />
          </Suspense>
        </>
      )}

      <Drawer
        anchor="right"
        open={isAlertManagerOpen}
        onClose={toggleAlertManager}
        PaperProps={{
          sx: {
            width: 400,
            maxWidth: '100%',
            backgroundColor: 'var(--paper-bg)',
            color: 'var(--color)'
          }
        }}
      >
        <AlertManager />
      </Drawer>

      <Snackbar
        open={!!alertNotification}
        autoHideDuration={6000}
        onClose={() => setAlertNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {alertNotification && (
          <Alert
            onClose={() => setAlertNotification(null)}
            severity={alertNotification.severity}
            sx={{ width: '100%' }}
          >
            {alertNotification.message}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
}
