import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import OAuthSuccess from './hooks/OAuthSuccess';
import { PrivateRoute } from './hooks/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';
import useAuthStore from './store/authStore';
import { useEffect, lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import { Box } from '@mui/material';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
import Register from './pages/Register';

export default function App() {
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-color)'
        }}
      >
        <Navbar />
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/oauth-success" element={<OAuthSuccess />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}