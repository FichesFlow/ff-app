import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

export default function SessionHeader({ deckTitle, currentCardIndex, totalCards }) {
  const progress = ((currentCardIndex) / totalCards) * 100;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          {deckTitle || "Session de révision"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Carte {currentCardIndex + 1} / {totalCards}
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 4 }} />
    </>
  );
}
