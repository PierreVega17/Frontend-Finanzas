import api from './api';

export const movementsService = {
  // Obtener todos los movimientos con filtros opcionales
  getMovements: async (year, month) => {
    let url = '/api/movements';
    const params = {};
    
    if (year) params.year = year;
    if (month) params.month = month;
    
    const { data } = await api.get(url, { params });
    return data;
  },

  // Crear un nuevo movimiento
  createMovement: async (movement) => {
    const { data } = await api.post('/api/movements', movement);
    return data;
  },

  // Actualizar un movimiento existente
  updateMovement: async (id, movement) => {
    const { data } = await api.put(`/api/movements/${id}`, movement);
    return data;
  },

  // Eliminar un movimiento
  deleteMovement: async (id) => {
    const { data } = await api.delete(`/api/movements/${id}`);
    return data;
  }
}; 