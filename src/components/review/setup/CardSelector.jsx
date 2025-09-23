import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ManualCardDisplay from './ManualCardDisplay';
import SrsCardDisplay from './SrsCardDisplay';

export default function CardSelector(
  {
    cardSource,
    showCards,
    onToggleShowCards,
    deck,
    selectedCards,
    mode,
    onCardSelection,
    dueCardsCount,
    newCount
  }
) {
  return (
    <FormControl sx={{mb: 4, width: '100%'}}>
      <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
        <FormLabel component="legend">
          {cardSource === 'due' ? 'Cartes à réviser' : 'Sélectionnez les fiches à réviser'}
        </FormLabel>
        <IconButton
          size="small"
          onClick={onToggleShowCards}
          aria-label={showCards ? "Masquer les fiches" : "Afficher les fiches"}
          sx={{ml: 1}}
        >
          {showCards ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
        </IconButton>
      </Box>

      {cardSource === 'manual' && showCards && (
        <ManualCardDisplay
          cards={deck.cards}
          selectedCards={selectedCards}
          deckTitle={deck.title}
          mode={mode}
          onCardSelection={onCardSelection}
        />
      )}

      {cardSource === 'due' && showCards && (
        <SrsCardDisplay
          cards={deck.cards}
          deckTitle={deck.title}
          dueCardsCount={dueCardsCount}
          newCount={newCount}
        />
      )}

      {cardSource === 'due' && !showCards && (
        <Box sx={{mb: 3}}>
          <Typography variant="body2" color="text.secondary">
            Les cartes dues et/ou à apprendre seront automatiquement sélectionnées selon l'algorithme de répétition
            espacée.
          </Typography>
        </Box>
      )}

      <FormLabel id="card-count-label" sx={{mt: 3}}>
        Nombre de fiches à réviser: {cardSource === 'due'
        ? (Math.min(dueCardsCount, dueCardsCount) + Math.min(newCount, newCount))
        : selectedCards.length
      }
      </FormLabel>
    </FormControl>
  );
}
