import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function ScoreButtons({ onScoreSelection, showAnswer, onShowAnswer }) {
  if (!showAnswer) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={onShowAnswer}
        >
          Afficher la réponse
        </Button>
      </Box>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ justifyContent: 'center', mt: 3 }}
    >
      <Button
        variant="outlined"
        color="error"
        onClick={() => onScoreSelection(0)}
        sx={{ minWidth: 140 }}
      >
        Je ne savais pas
      </Button>
      <Button
        variant="outlined"
        color="warning"
        onClick={() => onScoreSelection(3)}
        sx={{ minWidth: 140 }}
      >
        Presque
      </Button>
      <Button
        variant="outlined"
        color="success"
        onClick={() => onScoreSelection(5)}
        sx={{ minWidth: 140 }}
      >
        Facile
      </Button>
    </Stack>
  );
}
