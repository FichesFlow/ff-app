import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {MarkdownViewer} from '../components/flashcards/flashcard';
import {toast} from 'react-toastify';
import {createReviewEvent, endReviewSession, startReviewSession} from '../api/review';

export default function ReviewSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const {deckTitle, selectedCards, deckId, mode, cardSource, dueLimit, newCount} = location.state || {};

  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewSession, setReviewSession] = useState(null);
  const [hasApiError, setHasApiError] = useState(false);
  const hasInitialized = useRef(false);

  // Randomize cards and start review session on component mount
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

  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space' && !showAnswer) {
      setShowAnswer(true);
      e.preventDefault();
    } else if (showAnswer) {
      if (e.code === 'ArrowLeft') {
        handleScoreSelection(0); // Je ne savais pas
      } else if (e.code === 'ArrowDown') {
        handleScoreSelection(3); // Presque
      } else if (e.code === 'ArrowRight') {
        handleScoreSelection(5); // Facile
      }
    }
  }, [handleScoreSelection, showAnswer]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleReturnToDecks = () => {
    navigate('/review-queue');
  };

  if (!cards || cards.length === 0) {
    if (isLoading) {
      return (
        <Container maxWidth="md" sx={{mt: 4}}>
          <Typography variant="h4" component="h1" gutterBottom>
            Chargement de la session...
          </Typography>
          <LinearProgress/>
        </Container>
      );
    }

    return (
      <Container maxWidth="md" sx={{mt: 4}}>
        <Typography variant="h4" component="h1" gutterBottom>
          Session de révision invalide
        </Typography>
        <Typography>
          Aucune carte n'a été trouvée pour cette session. Veuillez configurer une session de révision.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(`/review?deck=${deckId}`)}
          startIcon={<ArrowBackIcon/>}
          sx={{mt: 2}}
        >
          Retour à la configuration
        </Button>
      </Container>
    );
  }

  if (isFinished) {
    const maxScore = cards.length * 5;
    const scorePercentage = (totalScore / maxScore) * 100;

    return (
      <Container maxWidth="md" sx={{mt: 4}}>
        <Paper elevation={3} sx={{p: 4, textAlign: 'center'}}>
          <CheckCircleOutlineIcon color="success" sx={{fontSize: 60, mb: 2}}/>
          <Typography variant="h4" gutterBottom>
            Révision terminée !
          </Typography>
          <Typography variant="h6" gutterBottom>
            Score: {totalScore} / {maxScore} ({Math.round(scorePercentage)}%)
          </Typography>
          <Typography color="text.secondary" sx={{mb: 3}}>
            Vous avez révisé {cards.length} cartes.
          </Typography>
          <Button
            variant="contained"
            onClick={handleReturnToDecks}
            startIcon={<ArrowBackIcon/>}
          >
            Retour à ma file de révision
          </Button>
        </Paper>
      </Container>
    );
  }

  const currentCard = cards[currentCardIndex];
  const frontSide = currentCard?.cardSides.find(side => side.side === "front");
  const backSide = currentCard?.cardSides.find(side => side.side === "back");
  const frontContent = frontSide?.cardBlock?.content || "Pas de contenu";
  const backContent = backSide?.cardBlock?.content || "Pas de contenu";
  const progress = ((currentCardIndex) / cards.length) * 100;

  return (
    <Container maxWidth="md" sx={{mt: 4}}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
        <Typography variant="h4" component="h1">
          {deckTitle || "Session de révision"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Carte {currentCardIndex + 1} / {cards.length}
        </Typography>
      </Box>

      <LinearProgress variant="determinate" value={progress} sx={{mb: 4}}/>

      <Card elevation={3} sx={{minHeight: 300, mb: 3}}>
        <CardContent sx={{height: '100%', p: 4}}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {showAnswer ? "Réponse" : "Question"}
          </Typography>
          <Divider sx={{mb: 3}}/>
          <Box sx={{whiteSpace: 'pre-wrap'}}>
            <MarkdownViewer source={showAnswer ? backContent : frontContent}/>
          </Box>
        </CardContent>
      </Card>

      {!showAnswer ? (
        <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
          <Button
            variant="contained"
            size="large"
            onClick={handleShowAnswer}
          >
            Afficher la réponse
          </Button>
        </Box>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          sx={{justifyContent: 'center', mt: 3}}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleScoreSelection(0)}
            sx={{minWidth: 140}}
          >
            Je ne savais pas
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => handleScoreSelection(3)}
            sx={{minWidth: 140}}
          >
            Presque
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={() => handleScoreSelection(5)}
            sx={{minWidth: 140}}
          >
            Facile
          </Button>
        </Stack>
      )}

      <Box sx={{mt: 4, textAlign: 'center'}}>
        <Typography variant="caption" color="text.secondary">
          Appuyez sur <strong>Espace</strong> pour afficher la réponse • Utilisez les <strong>flèches
          directionnelles</strong> pour noter
        </Typography>
      </Box>
    </Container>
  );
}