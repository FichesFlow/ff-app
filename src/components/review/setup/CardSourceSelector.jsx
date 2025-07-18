import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Badge from '@mui/material/Badge';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

export default function CardSourceSelector(
  {
    cardSource,
    onCardSourceChange,
    dueCardsCount,
    unseenCount
  }
) {
  return (
    <FormControl component="fieldset" sx={{mb: 4, width: '100%'}}>
      <FormLabel component="legend">Mode de sélection des cartes</FormLabel>
      <RadioGroup
        value={cardSource}
        onChange={(e) => onCardSourceChange(e.target.value)}
        sx={{mt: 1}}
      >
        <FormControlLabel
          value="due"
          disabled={(dueCardsCount + unseenCount) === 0}
          control={<Radio/>}
          label={
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              <span>Révision guidée (SRS)</span>
              <Tooltip
                title="Cartes dues aujourd'hui complétées par des cartes nouvelles si nécessaire."
                arrow
              >
                <InfoOutlinedIcon sx={{fontSize: 18}}/>
              </Tooltip>
              <Badge badgeContent={dueCardsCount} color="primary" sx={{ml: 1}}/>
            </Box>
          }
        />
        <FormControlLabel
          value="manual"
          control={<Radio/>}
          label={
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              <span>Révision libre</span>
              <Tooltip
                title="Vous choisissez les cartes ; cette session n'influe pas sur votre planning SRS."
                arrow
              >
                <InfoOutlinedIcon sx={{fontSize: 18}}/>
              </Tooltip>
            </Box>
          }
        />
      </RadioGroup>
    </FormControl>
  );
}
