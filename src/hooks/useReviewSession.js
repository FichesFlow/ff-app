import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { createReviewEvent, endReviewSession, startReviewSession } from '../api/review';

export function useReviewSession(deckId, mode, selectedCards, cardSource, dueLimit, newCount) {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewSession, setReviewSession] = useState(null);
  const [hasApiError, setHasApiError] = useState(false);
  const hasInitialized = useRef(false);

  // Initialize session
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    async function initSession() {
      try {
        setIsLoading(true);

        if (cardSource === 'due') {
          // For SRS mode, we don't have the cards yet - need to get them from the API
          const sessionData = await startReviewSession({
            deckId,
            mode,
            dueLimit,
            newCount
          });

          setReviewSession(sessionData);
          // Use cards returned from API
          if (sessionData.cards && sessionData.cards.length > 0) {
            setCards(sessionData.cards);
          } else {
            toast.error("Aucune carte à réviser n'a été retournée par le serveur.");
          }
        } else {
          // For manual mode, we already have the cards
          if (selectedCards && selectedCards.length > 0) {
            // Create a copy and shuffle the array
            const shuffled = [...selectedCards].sort(() => Math.random() - 0.5);
            setCards(shuffled);

            // Start a review session with card IDs
            const cardIds = shuffled.map(card => card.id);
            const sessionData = await startReviewSession({
              deckId,
              mode,
              cardIds
            });
            setReviewSession(sessionData);
          } else {
            toast.error('Aucune carte sélectionnée pour la révision.');
          }
        }
      } catch (error) {
        console.error('Failed to start review session:', error);
        toast.error('Impossible de démarrer la session de révision. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    }

    if (deckId && mode) {
      initSession();
    } else {
      setIsLoading(false);
    }
  }, [deckId, mode, selectedCards, cardSource, dueLimit, newCount]);

  const handleScoreSelection = useCallback(async (points) => {
    setTotalScore(prev => prev + points);

    // Create a review event (non-blocking)
    if (reviewSession && cards[currentCardIndex] && !hasApiError) {
      createReviewEvent({
        sessionId: reviewSession.id,
        cardId: cards[currentCardIndex].id,
        score: points
      }).catch((error) => {
        console.error('Failed to create review event:', error);
        setHasApiError(true);
        toast.warning("La session n'a pas pu être sauvegardée et ne sera pas enregistrée. Les données pourraient être perdues.");
      });
    }

    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      // End the review session
      if (reviewSession && !hasApiError) {
        try {
          await endReviewSession(reviewSession.id);
        } catch (error) {
          console.error('Failed to end review session:', error);
          toast.error('Impossible de terminer la session de révision correctement.');
        }
      } else if (hasApiError) {
        toast.warning("La session de révision n'a pas pu être terminée en raison d'erreurs précédentes.");
      }
      setIsFinished(true);
    }
  }, [cards, currentCardIndex, reviewSession, hasApiError]);

  const showAnswerHandler = useCallback(() => {
    setShowAnswer(true);
  }, []);

  return {
    cards,
    currentCardIndex,
    showAnswer,
    totalScore,
    isFinished,
    isLoading,
    handleScoreSelection,
    showAnswerHandler
  };
}
