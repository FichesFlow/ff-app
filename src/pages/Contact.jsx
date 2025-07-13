import React, { useState } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  Link
} from '@mui/material';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';


export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.message.length < 20) {
      setErrorMessage('Le message doit contenir au moins 20 caractères.');
      return;
    }

    setErrorMessage('');
    alert('Message envoyé !');
    setFormData({
      nom: '',
      email: '',
      sujet: '',
      message: ''
    });
  };

  useDocumentTitle('Contact – FichesFlow');

  return (
    <>
      <meta name="description" content="Contactez-nous pour toute question ou suggestion concernant FichesFlow." />
      <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contact
        </Typography>

        <Box
            display="flex"
            alignItems="center"
            gap={1}
            mt={2}
            mb={1}
        >
        <GitHubIcon color="action" />
        <Typography variant="body1">
            <Link
            href="https://github.com/FichesFlow"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ fontWeight: 'bold', color: 'inherit', textDecoration: 'none' }}
            >
            Projet GitHub
            </Link>
        </Typography>
        </Box>
        

        {/* Formulaire */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            required
            label="Sujet"
            name="sujet"
            value={formData.sujet}
            onChange={handleChange}
            margin="normal"
            select
          >
            <MenuItem value="bug">Signaler un bug</MenuItem>
            <MenuItem value="suggestion">Suggestion</MenuItem>
            <MenuItem value="autre">Autre</MenuItem>
          </TextField>

          <TextField
            fullWidth
            required
            multiline
            minRows={4}
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            margin="normal"
            inputProps={{ minLength: 20 }}
          />

          {errorMessage && (
            <Typography
              variant="body2"
              color="error"
              sx={{ mt: 1 }}
              aria-live="polite"
            >
              {errorMessage}
            </Typography>
          )}

          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            Envoyer
          </Button>
        </Box>
      </Container>
    </>
  );
}
