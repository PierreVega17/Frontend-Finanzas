import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Para manejar cookies si las usas
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para agregar el token
api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores y renovación de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();
    
    // Error 401 (No autorizado)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intenta renovar el token usando el refresh token
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
          refreshToken: authStore.refreshToken
        });
        
        const { accessToken, refreshToken } = response.data;
        authStore.setToken(accessToken);
        authStore.setRefreshToken(refreshToken);
        
        // Reintenta la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        authStore.clearToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;