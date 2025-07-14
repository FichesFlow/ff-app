import React from 'react';
import {Box, Button, LinearProgress, Typography} from '@mui/material';
import {Link} from 'react-router';

export default function ProgressSection() {
// TODO: remplacer par vraie progression récupérée depuis l'API
  const progressPercent = 65;

  return (
    <Box width="100%" maxWidth={500} textAlign="left">
      <Typography variant="h5" gutterBottom>
        Votre progression
      </Typography>
      <LinearProgress variant="determinate" value={progressPercent} sx={{height: 10, borderRadius: 5, mb: 1}}/>
      <Typography variant="body2" color="text.secondary">
        {`Vous avez complété ${progressPercent}% de votre session de révision.`}
      </Typography>
      <Box mt={2}>
        <Button
          component={Link}
          to="/review-queue"
          variant="contained"
          size="medium"
        >
          Continuer
        </Button>
      </Box>
    </Box>
  );
}