import React from 'react';
import { Box, Container, Typography, IconButton, Stack } from '@mui/material';
import { GitHub, LinkedIn, Instagram } from '@mui/icons-material';

export default function Footer() {
  const socialLinks = [
    {
      icon: <GitHub />,
      url: 'https://github.com/JeanPierrePG',
      label: 'GitHub'
    },
    {
      icon: <LinkedIn />,
      url: 'https://www.linkedin.com/in/jean-pierre-galarreta/',
      label: 'LinkedIn'
    },
    {
      icon: <Instagram />,
      url: 'https://www.instagram.com/jeanpierrepg/',
      label: 'Instagram'
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'var(--bg-color)',
        borderTop: '1px solid var(--border-color)',
        position: 'relative',
        bottom: 0,
        width: '100%'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'var(--color)',
                fontWeight: 500
              }}
            >
              Desarrollado por Jean Pierre Galarreta
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--secondary-text)',
                mt: 0.5
              }}
            >
              © {new Date().getFullYear()} Todos los derechos reservados
            </Typography>
          </Box>
          
          <Stack 
            direction="row" 
            spacing={2}
            sx={{
              '& a': {
                color: 'var(--color)',
                transition: 'color 0.2s',
                '&:hover': {
                  color: 'var(--primary)'
                }
              }
            }}
          >
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                component="a"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                sx={{
                  color: 'var(--color)',
                  '&:hover': {
                    backgroundColor: 'var(--hover-bg)'
                  }
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
} 