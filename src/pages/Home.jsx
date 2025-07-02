import React from 'react';
import {Box, Button, Stack, Typography} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import {Link} from 'react-router';
import ColorModeToggle from "../components/ui/ColorModeToggle.jsx";

export default function Home() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      gap={4}
      px={2}
    >
      <SchoolIcon sx={{fontSize: 96}} color="primary"/>

      <Typography variant="h3" component="h1" gutterBottom>
        Bienvenue sur FichesFlow
      </Typography>

      <Typography variant="h6" color="text.secondary" maxWidth={600}>
        Créez, partagez et révisez vos fiches de cours avec une touche de
        gamification. Boostez votre mémorisation grâce à la répétition espacée !
      </Typography>

      <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} mt={4}>
        <Button
          component={Link}
          to="/flashcards"
          variant="contained"
          size="large"
          color="primary"
        >
          Commencer une révision
        </Button>

        <Button
          component={Link}
          to="/notes"
          variant="outlined"
          size="large"
        >
          Parcourir les fiches
        </Button>

        <ColorModeToggle/>
      </Stack>
    </Box>
  );
}
