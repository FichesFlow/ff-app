import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function StartReviewButton(
  {
    onStartReview,
    deck,
    cardSource,
    selectedCards,
    dueLimit,
    dueCardsCount,
    newCount,
    unseenCount
  }
) {
  const isDisabled =
    deck?.card_count === 0 ||
    (cardSource === 'manual' && selectedCards.length === 0) ||
    (cardSource === 'due' && (Math.min(dueLimit, dueCardsCount) + Math.min(newCount, unseenCount)) === 0);

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={onStartReview}
        startIcon={<PlayArrowIcon/>}
        disabled={isDisabled}
      >
        Commencer la révision
      </Button>
    </Box>
  );
}
