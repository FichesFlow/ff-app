import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

export default function ManualSelectionControls({
  randomSelectionCount,
  eligibleCardsCount,
  onRandomSelectionChange,
  onRandomSelectionCommit
}) {
  return (
    <Box sx={{ mt: 2, mb: 4 }}>
      <Typography variant="body2" gutterBottom>
        Sélection aléatoire de cartes
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" sx={{ minWidth: '20px' }}>
          {randomSelectionCount}
        </Typography>
        <Slider
          value={randomSelectionCount}
          onChange={(_, newValue) => onRandomSelectionChange(newValue)}
          onChangeCommitted={(_, newValue) => onRandomSelectionCommit(newValue)}
          min={0}
          max={eligibleCardsCount || 0}
          valueLabelDisplay="auto"
          aria-labelledby="random-selection-slider"
          sx={{ mx: 2 }}
        />
        <Typography variant="body2" sx={{ minWidth: '35px' }}>
          {eligibleCardsCount || 0}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">
        Déplacez le curseur pour sélectionner aléatoirement un nombre de fiches (0 = sélection manuelle)
      </Typography>
    </Box>
  );
}
