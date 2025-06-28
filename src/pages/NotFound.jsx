import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Link } from 'react-router';

export default function NotFound() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      gap={4}
    >
      <ErrorOutlineIcon sx={{ fontSize: 96 }} color="error" />

      <Typography variant="h2" component="h1" gutterBottom>
        404
      </Typography>

      <Typography variant="h6" color="text.secondary" maxWidth={480}>
        Oups&nbsp;! La page que vous cherchez n'existe pas ou a été déplacée.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          color="primary"
        >
          Retour à l'accueil
        </Button>
      </Stack>
    </Box>
  );
}
