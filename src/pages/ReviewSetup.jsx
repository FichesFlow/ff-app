import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {useAuth} from '../context/AuthContext';
import {fetchDeck} from '../api/deck';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip';
import DeckPreviewCard from "../components/deck/DeckPreviewCard.jsx";
import OutlinedCard from "../components/flashcards/flashcard.jsx";
import Slider from '@mui/material/Slider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';

export default function ReviewSetup() {
  const [searchParams] = useSearchParams();
  const deckId = searchParams.get('deck');
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('flashcard');
  const [cardCount, setCardCount] = useState(10);
  const [selectedCards, setSelectedCards] = useState([]);
  const [randomSelectionCount, setRandomSelectionCount] = useState(0);
  const [showCards, setShowCards] = useState(true);

  const handleRandomSelection = (count) => {
    setRandomSelectionCount(count);
    if (count === 0) return;

    if (deck.cards?.length) {
      const shuffled = [...deck.cards].sort(() => 0.5 - Math.random());
      setSelectedCards(shuffled.slice(0, count).map(card => card.id));
    }
  };

  const handleCardSelection = (cardId) => {
    setSelectedCards(prev =>
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    );
  };

  const handleStartReview = () => {
    navigate('/review/session', {
      state: {
        deckId,
        cardCount,
        mode,
        selectedCardIds: selectedCards.length > 0 ? selectedCards : null
      }
    });
  };

  useDocumentTitle(
    loading ? "Chargement de la révision..." :
      error || !deck ? "Erreur - Préparation de la révision" :
        `Révision: ${deck.title} - Configuration`
  );

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', {replace: true});
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && !deckId) navigate('/decks', {replace: true});
  }, [deckId, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !deckId) return;

    const getDeck = async () => {
      try {
        setLoading(true);
        const deckData = await fetchDeck(deckId);
        setDeck(deckData);
        setCardCount(Math.min(10, deckData.card_count));

        if (deckData.cards?.length) {
          setSelectedCards(deckData.cards.map(card => card.id));
        }
      } catch (err) {
        console.error('Error fetching deck:', err);
        setError('Impossible de charger le deck. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    getDeck();
  }, [deckId, isAuthenticated]);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress aria-label="Chargement de la configuration de révision"/>
      </Box>
    );
  }

  if (error || !deck) {
    return (
      <Container maxWidth="md" sx={{mt: 4}}>
        <Alert severity="error">
          {error || "Deck non trouvé. Veuillez sélectionner un autre deck."}
        </Alert>
        <Box mt={2}>
          <Button variant="contained" onClick={() => navigate('/review-queue')}>
            Retour à ma file de révision
          </Button>
        </Box>
      </Container>
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
        <FormControl component="fieldset" sx={{mb: 4, width: '100%'}}>
          <FormLabel component="legend">Mode de révision</FormLabel>
          <Box sx={{display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 1}}>
            <Tooltip
              title='Affiche le recto de la carte ; appuyez sur "Afficher la réponse" ou la barre espace pour révéler le verso, puis notez votre réponse.'
              arrow placement="top">
              <Button
                variant={mode === 'flashcard' ? 'contained' : 'outlined'}
                onClick={() => setMode('flashcard')}
                sx={{width: '150px'}}
              >
                Flashcards
              </Button>
            </Tooltip>
            <Tooltip title="En développement" arrow placement="top">
              <span>
                <Button
                  variant={mode === 'qcm' ? 'contained' : 'outlined'}
                  onClick={() => setMode('qcm')}
                  disabled
                  sx={{width: '150px', opacity: 0.6}}
                >
                  QCM
                </Button>
              </span>
            </Tooltip>
          </Box>
        </FormControl>

        <Box sx={{mt: 2, mb: 4}}>
          <Typography variant="body2" gutterBottom>
            Sélection aléatoire de cartes
          </Typography>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
            <Typography variant="body2" sx={{minWidth: '20px'}}>
              {randomSelectionCount}
            </Typography>
            <Slider
              value={randomSelectionCount}
              onChange={(_, newValue) => setRandomSelectionCount(newValue)}
              onChangeCommitted={(_, newValue) => handleRandomSelection(newValue)}
              min={0}
              max={deck.cards?.length || 10}
              valueLabelDisplay="auto"
              aria-labelledby="random-selection-slider"
              sx={{mx: 2}}
            />
            <Typography variant="body2" sx={{minWidth: '35px'}}>
              {deck.cards?.length || 0}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Déplacez le curseur pour sélectionner aléatoirement un nombre de fiches (0 = sélection manuelle)
          </Typography>
        </Box>

        <FormControl sx={{mb: 4, width: '100%'}}>
          <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
            <FormLabel component="legend">
              Sélectionnez les fiches à réviser
            </FormLabel>
            <IconButton
              size="small"
              onClick={() => setShowCards(prev => !prev)}
              aria-label={showCards ? "Masquer les fiches" : "Afficher les fiches"}
              sx={{ml: 1}}
            >
              {showCards ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
            </IconButton>
          </Box>

          {showCards && (
            <Box sx={{mb: 3}}>
              <Grid container spacing={2}>
                {deck.cards?.map((card, index) => {
                  const frontSide = card.cardSides.find(side => side.side === "front");
                  const backSide = card.cardSides.find(side => side.side === "back");
                  const frontContent = frontSide?.cardBlock?.content || "";
                  const backContent = backSide?.cardBlock?.content || null;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={card.id || index}>
                      <Box
                        sx={{
                          cursor: 'pointer',
                          border: selectedCards.includes(card.id) ? '2px solid' : '',
                          borderColor: selectedCards.includes(card.id) ? 'primary.main' : 'divider',
                          transition: 'all 0.2s',
                          height: '100%',
                          '&:hover': {
                            borderColor: 'primary.main',
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={() => handleCardSelection(card.id)}
                      >
                        <OutlinedCard
                          sujet={deck.title}
                          description_recto={frontContent}
                          description_verso={backContent}
                          sx={{backgroundColor: selectedCards.includes(card.id) ? 'action.selected' : 'background.paper'}}
                        />
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          <FormLabel id="card-count-label" sx={{mt: 3}}>
            Nombre de fiches à réviser: {selectedCards.length}
          </FormLabel>
        </FormControl>

        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleStartReview}
            startIcon={<PlayArrowIcon/>}
            disabled={deck.card_count === 0}
          >
            Commencer la révision
          </Button>
        </Box>
      </Box>
    </Container>
  );
}