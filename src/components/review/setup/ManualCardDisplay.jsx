import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import OutlinedCard from '../../flashcards/flashcard';

export default function ManualCardDisplay(
  {
    cards,
    selectedCards,
    deckTitle,
    mode,
    onCardSelection
  }
) {
  return (
    <Box sx={{mb: 3}}>
      <Grid container spacing={2}>
        {cards?.map((card, index) => {
          const frontSide = card.cardSides.find(side => side.side === "front");
          const backSide = card.cardSides.find(side => side.side === "back");
          const frontContent = frontSide?.cardBlock?.content || "";
          const backContent = backSide?.cardBlock?.content || null;
          const hasBackContent = backContent !== null;
          const isSelectable = mode !== 'flashcard' || hasBackContent;

          return (
            <Grid item xs={12} sm={6} md={4} key={card.id || index}>
              <Box
                sx={{
                  cursor: isSelectable ? 'pointer' : 'not-allowed',
                  border: selectedCards.includes(card.id) ? '2px solid' : '',
                  borderColor: selectedCards.includes(card.id) ? 'primary.main' : 'divider',
                  transition: 'all 0.2s',
                  height: '100%',
                  opacity: isSelectable ? 1 : 0.6,
                  position: 'relative',
                  '&:hover': isSelectable ? {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)'
                  } : {}
                }}
                onClick={() => {
                  if (isSelectable) {
                    onCardSelection(card.id);
                  }
                }}
              >
                <OutlinedCard
                  sujet={deckTitle}
                  description_recto={frontContent}
                  description_verso={backContent}
                  sx={{
                    backgroundColor: selectedCards.includes(card.id) ? 'action.selected' : 'background.paper'
                  }}
                />
                {mode === 'flashcard' && !hasBackContent && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bgcolor: 'warning.light',
                    color: 'warning.contrastText',
                    px: 1,
                    borderBottomLeftRadius: 4
                  }}>
                    Pas de verso
                  </Box>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
