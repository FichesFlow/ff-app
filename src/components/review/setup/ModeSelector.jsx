import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Tooltip from '@mui/material/Tooltip';

export default function ModeSelector({mode, onModeChange}) {
  return (
    <FormControl component="fieldset" sx={{mb: 4, width: '100%'}}>
      <FormLabel component="legend">Mode de révision</FormLabel>
      <Box sx={{display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 1}}>
        <Tooltip
          title='Affiche le recto de la carte ; appuyez sur "Afficher la réponse" ou la barre espace pour révéler le verso, puis notez votre réponse.'
          arrow
          placement="top"
        >
          <Button
            variant={mode === 'flashcard' ? 'contained' : 'outlined'}
            onClick={() => onModeChange('flashcard')}
            sx={{width: '150px'}}
          >
            Flashcards
          </Button>
        </Tooltip>
        <Tooltip title="En développement" arrow placement="top">
          <span>
            <Button
              variant={mode === 'qcm' ? 'contained' : 'outlined'}
              onClick={() => onModeChange('qcm')}
              disabled
              sx={{width: '150px', opacity: 0.6}}
            >
              QCM
            </Button>
          </span>
        </Tooltip>
      </Box>
    </FormControl>
  );
}
