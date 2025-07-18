import {useLocation, useNavigate} from 'react-router';
import Container from '@mui/material/Container';
import {useReviewSession} from '../hooks/useReviewSession';
import {useKeyboardControls} from '../hooks/useKeyboardControls';
import {ReviewError, ReviewLoading} from '../components/review/ReviewStates';
import ReviewCompletion from '../components/review/ReviewCompletion';
import SessionHeader from '../components/review/SessionHeader';
import FlashCard from '../components/review/FlashCard';
import ScoreButtons from '../components/review/ScoreButtons';
import KeyboardInstructions from '../components/review/KeyboardInstructions';

export default function ReviewSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const {deckTitle, selectedCards, deckId, mode, cardSource, dueLimit, newCount} = location.state || {};

  const {
    cards,
    currentCardIndex,
    showAnswer,
    totalScore,
    isFinished,
    isLoading,
    handleScoreSelection,
    showAnswerHandler
  } = useReviewSession(deckId, mode, selectedCards, cardSource, dueLimit, newCount);

  // Set up keyboard controls
  useKeyboardControls(showAnswer, showAnswerHandler, handleScoreSelection);

  const handleReturnToDecks = () => {
    navigate('/review-queue');
  };

  // Loading state
  if (isLoading) {
    return <ReviewLoading/>;
  }

  // Error state - no cards found
  if (!cards || cards.length === 0) {
    return <ReviewError deckId={deckId} onNavigate={navigate}/>;
  }

  // Completion state
  if (isFinished) {
    return (
      <ReviewCompletion
        cards={cards}
        totalScore={totalScore}
        onReturnToDecks={handleReturnToDecks}
      />
    );
  }

  // Active review state
  const currentCard = cards[currentCardIndex];

  return (
    <Container maxWidth="md" sx={{mt: 4}}>
      <SessionHeader
        deckTitle={deckTitle}
        currentCardIndex={currentCardIndex}
        totalCards={cards.length}
      />

      <FlashCard card={currentCard} showAnswer={showAnswer}/>

      <ScoreButtons
        onScoreSelection={handleScoreSelection}
        showAnswer={showAnswer}
        onShowAnswer={showAnswerHandler}
      />

      <KeyboardInstructions/>
    </Container>
  );
}