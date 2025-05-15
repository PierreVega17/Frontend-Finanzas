import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Container,
  styled 
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  TrendingUp, 
  Savings, 
  AttachMoney,
  ArrowForward
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { Link } from 'react-router-dom';

// Animación de flotación
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Componente styled para el efecto de flotación
const FloatingCard = styled(Paper)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
    animation: `${float} 2s ease-in-out infinite`,
  },
}));

const WelcomePage = () => {

  return (
    <Container maxWidth="100%" sx={{ 
      backgroundColor: 'var(--bg-color)',
      height: '100vh',
      boxSizing: 'border-box',
      width: '100%',
     }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 10,
          background: `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`,
          color: 'var(--btn-color)',
          mb: 6,
          boxSizing: 'border-box',
          width: '100%',
          mx: 0,
          px: 0,
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' } 
          }}
        >
          Controla tus Finanzas con Confianza
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Organiza tus ingresos, gastos y ahorros en un solo lugar.
        </Typography>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          sx={{ 
            px: 4, 
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            backgroundColor: 'var(--btn-bg)',
            color: 'var(--btn-color)',
            '&:hover': {
              backgroundColor: 'var(--btn-hover-bg)',
            }
          }}
        >
          Empieza Ahora
        </Button>
      </Box>

      {/* Tarjetas Destacadas */}
      <Grid container spacing={4} sx={{ 
        mb: 8,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexWrap: 'wrap',
        px: 2
      }}>
        {[
          {
            icon: <AccountBalanceWallet fontSize="large" sx={{ color: 'var(--primary)' }} />,
            title: "Balance Total",
            value: "$5,430",
            description: "Tu saldo actual",
            color: 'var(--primary)',
          },
          {
            icon: <TrendingUp fontSize="large" sx={{ color: 'var(--success)' }} />,
            title: "Ingresos",
            value: "+$2,800",
            description: "Este mes",
            color: 'var(--success)',
          },
          {
            icon: <Savings fontSize="large" sx={{ color: 'var(--warning)' }} />,
            title: "Ahorros",
            value: "$1,200",
            description: "Meta mensual",
            color: 'var(--warning)',
          },
          {
            icon: <AttachMoney fontSize="large" sx={{ color: 'var(--error)' }} />,
            title: "Gastos",
            value: "-$1,570",
            description: "Este mes",
            color: 'var(--error)',
          },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <FloatingCard 
              elevation={3} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                borderLeft: `4px solid ${card.color}`,
                backgroundColor: 'var(--paper-bg)',
              }}
            >
              <Box sx={{ mb: 2 }}>{card.icon}</Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--color)' }}>
                {card.value}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1, color: 'var(--color)' }}>
                {card.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--secondary-text)' }}>
                {card.description}
              </Typography>
            </FloatingCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default WelcomePage;
