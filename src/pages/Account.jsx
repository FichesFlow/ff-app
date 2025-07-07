import {  useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';
import {Link, useNavigate} from 'react-router';
import {useAuth} from "../context/AuthContext.jsx";
import {useDocumentTitle} from "../hooks/useDocumentTitle.js";

export default function Account() {
  useDocumentTitle("Comptes utilisateur – FichesFlow");

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 480 }}>
        <Stack spacing={3} alignItems="center">
          <Avatar
            src={user.avatarUrl}
            alt={user.name}
            sx={{ width: 96, height: 96 }}
          />
          <Box textAlign="center">
            <Typography variant="h5" component="h1">
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>

          <Divider sx={{ width: '100%' }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} width="100%">
            <Button
              component={Link}
              onClick={() => alert('Modifier le profil')}
              startIcon={<EditIcon />}
              variant="contained"
              fullWidth
            >
              Modifier le profil
            </Button>
            <Button
              component={Link}
              onClick={() => alert('Sécurité')}
              startIcon={<SecurityIcon />}
              variant="outlined"
              fullWidth
            >
              Sécurité
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
