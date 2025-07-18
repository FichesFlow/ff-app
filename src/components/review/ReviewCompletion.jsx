import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ReviewCompletion({ cards, totalScore, onReturnToDecks }) {
  const maxScore = cards.length * 5;
  const scorePercentage = (totalScore / maxScore) * 100;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Révision terminée !
        </Typography>
        <Typography variant="h6" gutterBottom>
          Score: {totalScore} / {maxScore} ({Math.round(scorePercentage)}%)
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Vous avez révisé {cards.length} cartes.
        </Typography>
        <Button
          variant="contained"
          onClick={onReturnToDecks}
          startIcon={<ArrowBackIcon />}
        >
          Retour à ma file de révision
        </Button>
      </Paper>
    </Container>
  );
}
