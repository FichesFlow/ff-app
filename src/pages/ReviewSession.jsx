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
  const {deckTitle, selectedCards, deckId, mode} = location.state || {};

  const [randomizedCards, setRandomizedCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewSession, setReviewSession] = useState(null);
  const hasInitialized = useRef(false);

  // Randomize cards and start review session on component mount
  useEffect(() => {
    if (hasInitialized.current) return;

    if (selectedCards && selectedCards.length > 0 && deckId) {
      hasInitialized.current = true;

      // Create a copy and shuffle the array
      const shuffled = [...selectedCards].sort(() => Math.random() - 0.5);
      setRandomizedCards(shuffled);

      // Start a review session
      const cardIds = shuffled.map(card => card.id);
      startReviewSession({
        deckId: deckId,
        mode: mode,
        cardIds: cardIds
      }).then((sessionData) => {
        setReviewSession(sessionData);
        setIsLoading(false);
      }).catch(error => {
        console.error('Failed to start review session:', error);
        toast.warning('Failed to send review session data. Please try again later.');
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [selectedCards, deckId, mode]);

  const handleScoreSelection = useCallback(async (points) => {
    setTotalScore(prev => prev + points);

    // Create a review event
    if (reviewSession && randomizedCards[currentCardIndex]) {
      try {
        await createReviewEvent({
          sessionId: reviewSession.id,
          cardId: randomizedCards[currentCardIndex].id,
          score: points
        });
      } catch (error) {
        console.error('Failed to create review event:', error);
      }
    }

    if (currentCardIndex < randomizedCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      // End the review session
      if (reviewSession) {
        try {
          await endReviewSession(reviewSession.id);
        } catch (error) {
          console.error('Failed to end review session:', error);
        }
      }
      setIsFinished(true);
    }
  }, [randomizedCards, currentCardIndex, reviewSession]);

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

  if (!randomizedCards || randomizedCards.length === 0) {
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
          Aucun paramètre de révision n'a été fourni. Veuillez configurer une session de révision.
        </Typography>
      </Container>
    );
  }

  if (isFinished) {
    const maxScore = randomizedCards.length * 5;
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
            Vous avez révisé {randomizedCards.length} cartes.
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

  const currentCard = randomizedCards[currentCardIndex];
  const frontSide = currentCard?.cardSides.find(side => side.side === "front");
  const backSide = currentCard?.cardSides.find(side => side.side === "back");
  const frontContent = frontSide?.cardBlock?.content || "Pas de contenu";
  const backContent = backSide?.cardBlock?.content || "Pas de contenu";
  const progress = ((currentCardIndex) / randomizedCards.length) * 100;

  return (
    <Container maxWidth="md" sx={{mt: 4}}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
        <Typography variant="h4" component="h1">
          {deckTitle || "Session de révision"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Carte {currentCardIndex + 1} / {randomizedCards.length}
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