import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    // Decodificar el token (parte del payload)
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Verificar si el token ha expirado
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    console.error('Error al validar token:', error);
    return false;
  }
};

const getStoredToken = () => {
  // Primero intentar obtener de sessionStorage
  let token = sessionStorage.getItem('sessionToken');
  
  // Si no hay token en sessionStorage, intentar localStorage
  if (!token) {
    token = localStorage.getItem('rememberedToken');
  }
  
  return token && isTokenValid(token) ? token : null;
};

const initialState = {
  token: getStoredToken(),
  isInitialized: false
};

const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,
      
      setToken: (token, rememberMe = false) => {
        if (!token) {
          console.error('Intento de establecer un token nulo');
          return;
        }

        try {
          if (rememberMe) {
            localStorage.setItem('rememberedToken', token);
            sessionStorage.removeItem('sessionToken');
          } else {
            sessionStorage.setItem('sessionToken', token);
            localStorage.removeItem('rememberedToken');
          }
          
          set({ 
            token, 
            isInitialized: true 
          });
        } catch (error) {
          console.error('Error al establecer el token:', error);
          set({ token: null, isInitialized: true });
        }
      },
      
      clearToken: () => {
        localStorage.removeItem('rememberedToken');
        sessionStorage.removeItem('sessionToken');
        set({ token: null, isInitialized: true });
      },
      
      initializeAuth: () => {
        const token = getStoredToken();
        set({ token, isInitialized: true });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        // Validar el token después de rehidratar el estado
        if (state && state.token && !isTokenValid(state.token)) {
          state.clearToken();
        }
      }
    }
  )
);

export default useAuthStore;