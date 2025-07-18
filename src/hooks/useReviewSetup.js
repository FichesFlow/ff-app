import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router';
import {useAuth} from '../context/AuthContext';
import {fetchDeckWithStats} from '../api/deck';

export function useReviewSetup() {
  const [searchParams] = useSearchParams();
  const deckId = searchParams.get('deck');
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();

  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('flashcard');
  const [selectedCards, setSelectedCards] = useState([]);
  const [randomSelectionCount, setRandomSelectionCount] = useState(0);
  const [showCards, setShowCards] = useState(true);
  const [eligibleCardsCount, setEligibleCardsCount] = useState(0);
  const [cardSource, setCardSource] = useState('due');
  const [dueCardsCount, setDueCardsCount] = useState(0);
  const [unseenCount, setUnseenCount] = useState(0);
  const [dueLimit, setDueLimit] = useState(0);
  const [newCount, setNewCount] = useState(0);

  // Calculate and cache eligible cards count
  useEffect(() => {
    if (!deck?.cards) return;

    const eligibleCardsCount = mode === 'flashcard'
      ? deck.cards.filter(card => card.cardSides.some(side => side.side === "back")).length
      : deck.cards.length;

    setEligibleCardsCount(eligibleCardsCount);
  }, [deck?.cards, mode]);

  // Fetch deck data
  useEffect(() => {
    if (!isAuthenticated || !deckId) return;

    const getDeck = async () => {
      try {
        setLoading(true);
        const deckData = await fetchDeckWithStats(deckId);
        setDeck(deckData);

        // Use review stats from API response
        setDueCardsCount(deckData.review?.dueCount || 0);
        setUnseenCount(deckData.review?.unseenCount || 0);

        if (deckData.cards?.length) {
          if (mode === 'flashcard') {
            // Only select cards that have a backside
            const cardsWithBackside = deckData.cards.filter(card =>
              card.cardSides.some(side => side.side === "back")
            );
            setSelectedCards(cardsWithBackside.map(card => card.id));
          } else {
            // Select all cards for other modes
            setSelectedCards(deckData.cards.map(card => card.id));
          }
        }
      } catch (err) {
        console.error('Error fetching deck:', err);
        setError('Impossible de charger le deck. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    getDeck();
  }, [deckId, isAuthenticated, mode]);

  // Set initial values for dueLimit and newCount when stats change
  useEffect(() => {
    setDueLimit(dueCardsCount);
    setNewCount(Math.min(5, unseenCount));
  }, [dueCardsCount, unseenCount]);

  // Navigation guards
  useEffect(() => {
    if (!isAuthenticated) navigate('/login', {replace: true});
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && !deckId) navigate('/decks', {replace: true});
  }, [deckId, isAuthenticated, navigate]);

  const handleRandomSelection = (count) => {
    setRandomSelectionCount(count);
    if (count === 0) return;

    if (deck.cards?.length) {
      // Filter cards that have backside if in flashcard mode
      const eligibleCards = mode === 'flashcard'
        ? deck.cards.filter(card => card.cardSides.some(side => side.side === "back"))
        : deck.cards;

      const shuffled = [...eligibleCards].sort(() => 0.5 - Math.random());
      setSelectedCards(shuffled.slice(0, count).map(card => card.id));
    }
  };

  const handleCardSelection = (cardId) => {
    setSelectedCards(prev =>
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    );
  };

  const handleStartReview = () => {
    if (cardSource === 'due') {
      // For SRS mode, pass the limits to the backend
      navigate('/review/session', {
        state: {
          mode: mode,
          deckId,
          deckTitle: deck.title,
          cardSource: 'due',
          dueLimit: Math.min(dueLimit, dueCardsCount),
          newCount: Math.min(newCount, unseenCount)
        }
      });
    } else {
      // For manual mode, include selected cards
      const selectedCardsData = deck.cards.filter(card =>
        selectedCards.includes(card.id)
      );

      navigate('/review/session', {
        state: {
          mode: mode,
          deckId,
          deckTitle: deck.title,
          selectedCards: selectedCardsData
        }
      });
    }
  };

  return {
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
    deckId,
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
  };
}
