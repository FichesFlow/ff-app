import {useSearchParams} from 'react-router';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {useReviewSetup} from '../hooks/useReviewSetup';
import DeckPreviewCard from "../components/deck/DeckPreviewCard.jsx";
import {ReviewSetupError, ReviewSetupLoading} from '../components/review/setup/ReviewSetupStates';
import ModeSelector from '../components/review/setup/ModeSelector';
import CardSourceSelector from '../components/review/setup/CardSourceSelector';
import SrsControls from '../components/review/setup/SrsControls';
import ManualSelectionControls from '../components/review/setup/ManualSelectionControls';
import CardSelector from '../components/review/setup/CardSelector';
import StartReviewButton from '../components/review/setup/StartReviewButton';

export default function ReviewSetup() {
  const [searchParams] = useSearchParams();
  const deckId = searchParams.get('deck');

  const {
    // State
    deck,
    loading,
    error,
    mode,
    selectedCards,
    randomSelectionCount,
    showCards,
    eligibleCardsCount,
    cardSource,
    dueCardsCount,
    unseenCount,
    dueLimit,
    newCount,
    // Setters
    setMode,
    setCardSource,
    setShowCards,
    setDueLimit,
    setNewCount,
    setRandomSelectionCount,
    // Handlers
    handleRandomSelection,
    handleCardSelection,
    handleStartReview
  } = useReviewSetup(deckId);

  useDocumentTitle(
    loading ? "Chargement de la révision..." :
      error || !deck ? "Erreur - Préparation de la révision" :
        `Révision: ${deck.title} - Configuration`
  );

  // Loading state
  if (loading) {
    return <ReviewSetupLoading/>;
  }

  // Error state
  if (error || !deck) {
    return (
      <ReviewSetupError
        error={error}
        onReturnToQueue={() => window.location.href = '/review-queue'}
      />
    );
  }

  return (
    <Container maxWidth="md" sx={{mt: 4, mb: 6}}>
      <Typography variant="h4" component="h1" gutterBottom>
        Configuration de la révision
      </Typography>

      <Box mb={4}>
        <DeckPreviewCard deck={deck} showSeeButton={false} transition={false}/>
      </Box>

      <Box component="form" sx={{mb: 4}}>
        <ModeSelector mode={mode} onModeChange={setMode}/>

        <CardSourceSelector
          cardSource={cardSource}
          onCardSourceChange={setCardSource}
          dueCardsCount={dueCardsCount}
          unseenCount={unseenCount}
        />

        {cardSource === 'due' && (
          <SrsControls
            dueCardsCount={dueCardsCount}
            unseenCount={unseenCount}
            dueLimit={dueLimit}
            newCount={newCount}
            onDueLimitChange={setDueLimit}
            onNewCountChange={setNewCount}
          />
        )}

        {cardSource === 'manual' && (
          <ManualSelectionControls
            randomSelectionCount={randomSelectionCount}
            eligibleCardsCount={eligibleCardsCount}
            onRandomSelectionChange={setRandomSelectionCount}
            onRandomSelectionCommit={handleRandomSelection}
          />
        )}

        <CardSelector
          cardSource={cardSource}
          showCards={showCards}
          onToggleShowCards={() => setShowCards(prev => !prev)}
          deck={deck}
          selectedCards={selectedCards}
          mode={mode}
          onCardSelection={handleCardSelection}
          dueCardsCount={dueLimit}
          newCount={newCount}
        />

        <StartReviewButton
          onStartReview={handleStartReview}
          deck={deck}
          cardSource={cardSource}
          selectedCards={selectedCards}
          dueLimit={dueLimit}
          dueCardsCount={dueCardsCount}
          newCount={newCount}
          unseenCount={unseenCount}
        />
      </Box>
    </Container>
  );
}