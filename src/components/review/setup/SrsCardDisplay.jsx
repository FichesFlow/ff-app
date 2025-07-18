import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import OutlinedCard from '../../flashcards/flashcard';

export default function SrsCardDisplay(
  {
    cards,
    deckTitle,
    dueCardsCount,
    newCount
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

          // Determine if this card is due (first dueCardsCount cards with reviewStatus 'due')
          // and if this card is to be learned (first newCount unseen cards)
          const isDue = index < dueCardsCount;
          // Find all unseen cards indices
          const unseenIndices = cards
            .map((c, i) => c.reviewStatus === 'never_seen' ? i : null)
            .filter(i => i !== null);
          const isLearn = !isDue && card.reviewStatus === 'never_seen' &&
            unseenIndices.indexOf(index) > -1 &&
            unseenIndices.indexOf(index) < newCount;

          // Add: isNotDueYet for special border
          const isNotDueYet = card.reviewStatus === 'not_due_yet';

          let borderColor = 'divider';
          let bgColor = 'background.paper';
          let label = null;
          let labelColor = {};

          if (isDue) {
            borderColor = 'info.main';
            bgColor = 'info.light';
            label = 'Due';
            labelColor = {
              bgcolor: 'info.main',
              color: 'info.contrastText'
            };
          } else if (isLearn) {
            borderColor = 'success.main';
            bgColor = 'success.light';
            label = 'Learn';
            labelColor = {
              bgcolor: 'success.main',
              color: 'success.contrastText'
            };
          } else if (isNotDueYet) {
            borderColor = 'warning.main';
            bgColor = 'warning.light';
            label = 'À venir';
            labelColor = {
              bgcolor: 'warning.main',
              color: 'warning.contrastText'
            };
          }

          return (
            <Grid item xs={12} sm={6} md={4} key={card.id || index}>
              <Box
                sx={{
                  cursor: 'default',
                  border: '2px solid',
                  borderColor,
                  transition: 'all 0.2s',
                  height: '100%',
                  position: 'relative',
                  backgroundColor: bgColor,
                  opacity: 0.8
                }}
              >
                <OutlinedCard
                  sujet={deckTitle}
                  description_recto={frontContent}
                  description_verso={backContent}
                  sx={{
                    backgroundColor: bgColor
                  }}
                />
                {label && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    px: 1,
                    borderBottomLeftRadius: 4,
                    fontSize: '0.75rem',
                    ...labelColor
                  }}>
                    {label}
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
