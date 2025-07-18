import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function ReviewLoading() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Chargement de la session...
      </Typography>
      <LinearProgress />
    </Container>
  );
}

export function ReviewError({ deckId, onNavigate }) {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Session de révision invalide
      </Typography>
      <Typography>
        Aucune carte n'a été trouvée pour cette session. Veuillez configurer une session de révision.
      </Typography>
      <Button
        variant="contained"
        onClick={() => onNavigate(`/review?deck=${deckId}`)}
        startIcon={<ArrowBackIcon />}
        sx={{ mt: 2 }}
      >
        Retour à la configuration
      </Button>
    </Container>
  );
}
