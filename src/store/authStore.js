import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import jwtDecode from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      
      // Decodificar token para obtener información del usuario
      getUserData: () => {
        const token = get().token;
        if (!token) return null;
        try {
          return jwtDecode(token);
        } catch (error) {
          console.error('Error decodificando token:', error);
          return null;
        }
      },
      
      // Verificar si el token es válido
      isTokenValid: () => {
        const token = get().token;
        if (!token) return false;
        try {
          const { exp } = jwtDecode(token);
          return exp * 1000 > Date.now();
        } catch (error) {
          console.error('Error validando token:', error);
          return false;
        }
      },
      
      setToken: (token, rememberMe = false) => {
        if (!token) {
          console.error('Token no proporcionado');
          return;
        }
        
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', token);
        
        set({ 
          token,
          isAuthenticated: true 
        });
      },
      
      setRefreshToken: (refreshToken) => {
        if (!refreshToken) {
          console.error('Refresh token no proporcionado');
          return;
        }
        
        localStorage.setItem('refreshToken', refreshToken);
        set({ refreshToken });
      },
      
      clearToken: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('token');
        set({ 
          token: null,
          refreshToken: null,
          isAuthenticated: false 
        });
      },
      
      initialize: () => {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (token) {
          set({ 
            token,
            refreshToken,
            isAuthenticated: true 
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken
      })
    }
  )
);

export default useAuthStore;