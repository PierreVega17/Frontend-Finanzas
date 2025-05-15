import api from './api';

export const alertsService = {
  // Obtener todas las alertas
  getAlerts: async () => {
    const { data } = await api.get('/api/alerts');
    return data;
  },

  // Crear una nueva alerta
  createAlert: async (alert) => {
    const { data } = await api.post('/api/alerts', alert);
    return data;
  },

  // Actualizar una alerta existente
  updateAlert: async (id, alert) => {
    const { data } = await api.put(`/api/alerts/${id}`, alert);
    return data;
  },

  // Eliminar una alerta
  deleteAlert: async (id) => {
    const { data } = await api.delete(`/api/alerts/${id}`);
    return data;
  },

  // Verificar alertas
  checkAlerts: async () => {
    const { data } = await api.get('/api/alerts/check');
    return data;
  }
}; 