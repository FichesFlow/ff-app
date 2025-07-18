import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function KeyboardInstructions() {
  return (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="caption" color="text.secondary">
        Appuyez sur <strong>Espace</strong> pour afficher la réponse • Utilisez les <strong>flèches
        directionnelles</strong> pour noter
      </Typography>
    </Box>
  );
}
