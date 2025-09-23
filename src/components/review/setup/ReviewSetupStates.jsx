import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

export function ReviewSetupLoading() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress aria-label="Chargement de la configuration de révision"/>
    </Box>
  );
}

export function ReviewSetupError({error, onReturnToQueue}) {
  return (
    <Container maxWidth="md" sx={{mt: 4}}>
      <Alert severity="error">
        {error || "Deck non trouvé. Veuillez sélectionner un autre deck."}
      </Alert>
      <Box mt={2}>
        <Button variant="contained" onClick={onReturnToQueue}>
          Retour à ma file de révision
        </Button>
      </Box>
    </Container>
  );
}
