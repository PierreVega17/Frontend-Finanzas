import React from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { Brightness4, Brightness7 } from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  // Para depuración
  console.log('Estado de autenticación:', token);
  console.log('Ubicación actual:', location.pathname);

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  // Solo ocultamos el Navbar en la página de inicio
  const isHomePage = location.pathname === "/";
  
  if (isHomePage) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        boxSizing: 'border-box', 
        maxWidth: '100%', 
        padding: 0, 
        margin: 0,
        overflowX: 'hidden',
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: 'var(--navbar-bg)', color: 'var(--navbar-color)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to={token ? "/dashboard" : "/"} style={{ textDecoration: 'none', color: 'var(--navbar-color)' }}>
              Mis Finanzas
            </Link>
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit" size="large">
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {token ? (
              <Button 
                color="inherit" 
                onClick={handleLogout}
                sx={{ display: 'block' }}
              >
                Cerrar sesión
              </Button>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Registro
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default React.memo(Navbar);
