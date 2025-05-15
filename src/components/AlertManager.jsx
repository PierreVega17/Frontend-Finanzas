import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Switch,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, NotificationsActive } from '@mui/icons-material';
import { alertsService } from '../services/alerts';
import useAuthStore from '../store/authStore';

export default function AlertManager() {
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [formData, setFormData] = useState({
    threshold: '',
    frequency: 'monthly'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [checkResults, setCheckResults] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await alertsService.getAlerts();
      setAlerts(data);
    } catch (error) {
      showSnackbar('Error al obtener alertas', 'error');
    }
  };

  const checkAlerts = async () => {
    try {
      const data = await alertsService.checkAlerts();
      setCheckResults(data);
      
      if (data.triggeredAlerts.length > 0) {
        showSnackbar(`¡Se han activado ${data.triggeredAlerts.length} alertas!`, 'warning');
      } else {
        showSnackbar('No se han activado alertas', 'info');
      }
    } catch (error) {
      showSnackbar('Error al verificar alertas', 'error');
    }
  };

  const handleOpen = (alert = null) => {
    if (alert) {
      setFormData({
        threshold: alert.threshold,
        frequency: alert.frequency
      });
      setEditingAlert(alert);
    } else {
      setFormData({
        threshold: '',
        frequency: 'monthly'
      });
      setEditingAlert(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAlert(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAlert) {
        await alertsService.updateAlert(editingAlert._id, formData);
        showSnackbar('Alerta actualizada correctamente');
      } else {
        await alertsService.createAlert(formData);
        showSnackbar('Alerta creada correctamente');
      }
      fetchAlerts();
      handleClose();
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handleDelete = async (alertId) => {
    try {
      await alertsService.deleteAlert(alertId);
      showSnackbar('Alerta eliminada correctamente');
      fetchAlerts();
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handleToggleActive = async (alert) => {
    try {
      await alertsService.updateAlert(alert._id, { active: !alert.active });
      showSnackbar(`Alerta ${alert.active ? 'desactivada' : 'activada'} correctamente`);
      fetchAlerts();
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const frequencyLabels = {
    daily: 'Diaria',
    weekly: 'Semanal',
    monthly: 'Mensual'
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Alertas Financieras</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={checkAlerts}
            startIcon={<NotificationsActive />}
          >
            Verificar Alertas
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Nueva Alerta
          </Button>
        </Box>
      </Box>

      {checkResults && (
        <Paper sx={{ p: 2, mb: 3, backgroundColor: 'var(--paper-bg)' }}>
          <Typography variant="h6" gutterBottom>
            Resultados de la verificación
          </Typography>
          <Typography>
            Alertas verificadas: {checkResults.alertsChecked}
          </Typography>
          {checkResults.triggeredAlerts.map((result, index) => (
            <Box key={index} sx={{ mt: 2, p: 2, bgcolor: 'var(--warning-bg)', borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--warning-text)' }}>
                ¡Alerta activada! Umbral: {result.alert.currency || '$'}{result.alert.threshold}
              </Typography>
              <Typography variant="body2">
                Total de gastos: {result.currency || '$'}{result.totalExpenses.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                Período: {new Date(result.period.start).toLocaleDateString()} - {new Date(result.period.end).toLocaleDateString()}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}

      <List>
        {alerts.map((alert) => (
          <ListItem
            key={alert._id}
            sx={{
              mb: 1,
              bgcolor: 'var(--paper-bg)',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'var(--hover-bg)'
              }
            }}
          >
            <ListItemText
              primary={
                <Typography>
                  Umbral: {alert.currency || '$'}{alert.threshold} ({frequencyLabels[alert.frequency]})
                </Typography>
              }
              secondary={
                <Typography variant="body2" sx={{ color: 'var(--secondary-text)' }}>
                  Estado: {alert.active ? 'Activa' : 'Inactiva'}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={alert.active}
                onChange={() => handleToggleActive(alert)}
              />
              <IconButton
                edge="end"
                onClick={() => handleOpen(alert)}
                sx={{ ml: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleDelete(alert._id)}
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingAlert ? 'Editar Alerta' : 'Nueva Alerta'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Umbral"
              type="number"
              value={formData.threshold}
              onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Frecuencia</InputLabel>
              <Select
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                label="Frecuencia"
              >
                <MenuItem value="daily">Diaria</MenuItem>
                <MenuItem value="weekly">Semanal</MenuItem>
                <MenuItem value="monthly">Mensual</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAlert ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 