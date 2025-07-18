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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Badge from '@mui/material/Badge';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

export default function ReviewSetup() {
  const [searchParams] = useSearchParams();
  const deckId = searchParams.get('deck');
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  useDocumentTitle(
    loading ? "Chargement de la révision..." :
      error || !deck ? "Erreur - Préparation de la révision" :
        `Révision: ${deck.title} - Configuration`
  );

  // calculate and cache eligible cards count
  useEffect(() => {
    if (!deck?.cards) return;

    const eligibleCardsCount = mode === 'flashcard'
      ? deck.cards.filter(card => card.cardSides.some(side => side.side === "back")).length
      : deck.cards.length;

    setEligibleCardsCount(eligibleCardsCount);
  }, [deck?.cards, mode]);

  // Add effect to calculate unseen cards count
  useEffect(() => {
    if (!deck?.cards) return;

    // TODO: Replace with actual unseen cards logic based on review history
    // For now, simulate unseen cards (cards never reviewed)
    const simulatedUnseenCount = Math.max(0, deck.cards.length - Math.floor(deck.cards.length * 0.3));
    setUnseenCount(simulatedUnseenCount);
  }, [deck?.cards]);

  // Add effect to calculate due cards count
  useEffect(() => {
    if (!deck?.cards) return;

    // TODO: Replace with actual due cards logic based on spaced repetition
    // For now, simulate some due cards
    const simulatedDueCount = Math.min(12, deck.cards.length);
    setDueCardsCount(simulatedDueCount);

    // Set initial values
    const simulatedUnseenCount = Math.max(0, deck.cards.length - Math.floor(deck.cards.length * 0.3));
    setDueLimit(simulatedDueCount);
    setNewCount(Math.min(5, simulatedUnseenCount));

    // If no due cards, force manual selection
    if (simulatedDueCount === 0) {
      setCardSource('manual');
    }
  }, [deck?.cards, unseenCount]);

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

        <FormControl component="fieldset" sx={{mb: 4, width: '100%'}}>
          <FormLabel component="legend">Mode de sélection des cartes</FormLabel>
          <RadioGroup
            value={cardSource}
            onChange={(e) => setCardSource(e.target.value)}
            sx={{mt: 1}}
          >
            <FormControlLabel
              value="due"
              disabled={dueCardsCount === 0}
              control={<Radio/>}
              label={
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                  <span>Révision guidée (SRS)</span>

                  <Tooltip
                    title="Cartes dues aujourd’hui complétées par des cartes nouvelles si nécessaire."
                    arrow
                  >
                    <InfoOutlinedIcon sx={{fontSize: 18}}/>
                  </Tooltip>

                  <Badge badgeContent={dueCardsCount} color="primary" sx={{ml: 1}}/>
                </Box>
              }
            />
            <FormControlLabel
              value="manual"
              control={<Radio/>}
              label={
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                  <span>Révision libre</span>
                  <Tooltip
                    title="Vous choisissez les cartes ; cette session n’influe pas sur votre planning SRS."
                    arrow
                  >
                    <InfoOutlinedIcon sx={{fontSize: 18}}/>
                  </Tooltip>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        {cardSource === 'due' && (
          <Box sx={{mt: 2, mb: 4}}>
            <Stack direction={isMobile ? "column" : "row"} spacing={4}>
              <Box sx={{flex: 1}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                  <Typography variant="body2">
                    Cartes dues (0–{dueCardsCount})
                  </Typography>
                  <Tooltip title="Cartes planifiées par le SRS pour aujourd'hui." arrow>
                    <InfoOutlinedIcon sx={{fontSize: 16}}/>
                  </Tooltip>
                </Box>

                <Slider
                  value={dueLimit}
                  onChange={(_, newValue) => setDueLimit(newValue)}
                  min={0}
                  max={dueCardsCount}
                  valueLabelDisplay="auto"
                  aria-label="Nombre de cartes dues"
                  disabled={dueCardsCount === 0}
                  marks={[
                    {value: 0, label: '0'},
                    {value: dueCardsCount, label: String(dueCardsCount)}
                  ]}
                />
              </Box>

              <Box sx={{flex: 1}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                  <Typography variant="body2">
                    Nouvelles cartes (0–{unseenCount})
                  </Typography>
                  <Tooltip title="Cartes jamais revues qui seront ajoutées en plus des cartes dues." arrow>
                    <InfoOutlinedIcon sx={{fontSize: 16}}/>
                  </Tooltip>
                  {unseenCount > 0 && (
                    <Badge badgeContent={unseenCount} color="secondary" sx={{ml: 1}}/>
                  )}
                </Box>

                <Slider
                  value={newCount}
                  onChange={(_, newValue) => setNewCount(newValue)}
                  min={0}
                  max={unseenCount}
                  valueLabelDisplay="auto"
                  aria-label="Nombre de cartes nouvelles"
                  disabled={unseenCount === 0}
                  marks={[
                    {value: 0, label: '0'},
                    {value: unseenCount, label: String(unseenCount)}
                  ]}
                />
              </Box>
            </Stack>

            <Box sx={{mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1}}>
              <Typography variant="body2" color="text.secondary">
                Total sélectionné
                : <strong>{Math.min(dueLimit, dueCardsCount)} dues</strong> + <strong>{Math.min(newCount, unseenCount)} nouvelles</strong> = <strong>{Math.min(dueLimit, dueCardsCount) + Math.min(newCount, unseenCount)} cartes</strong>
              </Typography>
            </Box>
          </Box>
        )}

        {cardSource === 'manual' && (
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
                max={eligibleCardsCount || 0}
                valueLabelDisplay="auto"
                aria-labelledby="random-selection-slider"
                sx={{mx: 2}}
              />
              <Typography variant="body2" sx={{minWidth: '35px'}}>
                {eligibleCardsCount || 0}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Déplacez le curseur pour sélectionner aléatoirement un nombre de fiches (0 = sélection manuelle)
            </Typography>
          </Box>
        )}

        <FormControl sx={{mb: 4, width: '100%'}}>
          <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
            <FormLabel component="legend">
              {cardSource === 'due' ? 'Cartes à réviser' : 'Sélectionnez les fiches à réviser'}
            </FormLabel>
            {cardSource === 'manual' && (
              <IconButton
                size="small"
                onClick={() => setShowCards(prev => !prev)}
                aria-label={showCards ? "Masquer les fiches" : "Afficher les fiches"}
                sx={{ml: 1}}
              >
                {showCards ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
              </IconButton>
            )}
            {cardSource === 'due' && dueCardsCount > 0 && (
              <IconButton
                size="small"
                onClick={() => setShowCards(prev => !prev)}
                aria-label={showCards ? "Masquer les fiches" : "Afficher les fiches"}
                sx={{ml: 1}}
              >
                {showCards ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
              </IconButton>
            )}
          </Box>

          {cardSource === 'manual' && showCards && (
            <Box sx={{mb: 3}}>
              <Grid container spacing={2}>
                {deck.cards?.map((card, index) => {
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
                          '&:hover': isSelectable ? {
                            borderColor: 'primary.main',
                            transform: 'translateY(-2px)'
                          } : {}
                        }}
                        onClick={() => {
                          if (isSelectable) {
                            handleCardSelection(card.id);
                          }
                        }}
                      >
                        <OutlinedCard
                          sujet={deck.title}
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
          )}

          {cardSource === 'due' && dueCardsCount > 0 && showCards && (
            <Box sx={{mb: 3}}>
              <Grid container spacing={2}>
                {deck.cards?.slice(0, dueCardsCount).map((card, index) => {
                  const frontSide = card.cardSides.find(side => side.side === "front");
                  const backSide = card.cardSides.find(side => side.side === "back");
                  const frontContent = frontSide?.cardBlock?.content || "";
                  const backContent = backSide?.cardBlock?.content || null;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={card.id || index}>
                      <Box
                        sx={{
                          cursor: 'default',
                          border: '2px solid',
                          borderColor: 'info.main',
                          transition: 'all 0.2s',
                          height: '100%',
                          position: 'relative'
                        }}
                      >
                        <OutlinedCard
                          sujet={deck.title}
                          description_recto={frontContent}
                          description_verso={backContent}
                          sx={{
                            backgroundColor: 'info.light',
                            opacity: 0.8
                          }}
                        />
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bgcolor: 'info.main',
                          color: 'info.contrastText',
                          px: 1,
                          borderBottomLeftRadius: 4,
                          fontSize: '0.75rem'
                        }}>
                          Due
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          {cardSource === 'due' && dueCardsCount === 0 && (
            <Box sx={{mb: 3}}>
              <Typography variant="body2" color="text.secondary">
                🎉 Aucune carte due aujourd'hui.
              </Typography>
            </Box>
          )}

          {cardSource === 'due' && dueCardsCount > 0 && !showCards && (
            <Box sx={{mb: 3}}>
              <Typography variant="body2" color="text.secondary">
                Les cartes dues seront automatiquement sélectionnées selon l'algorithme de répétition espacée.
              </Typography>
            </Box>
          )}

          <FormLabel id="card-count-label" sx={{mt: 3}}>
            Nombre de fiches à réviser: {cardSource === 'due' ?
            (Math.min(dueLimit, dueCardsCount) + Math.min(newCount, unseenCount)) :
            selectedCards.length
          }
          </FormLabel>
        </FormControl>

        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleStartReview}
            startIcon={<PlayArrowIcon/>}
            disabled={
              deck.card_count === 0 ||
              (cardSource === 'manual' && selectedCards.length === 0) ||
              (cardSource === 'due' && (Math.min(dueLimit, dueCardsCount) + Math.min(newCount, unseenCount)) === 0)
            }
          >
            Commencer la révision
          </Button>
        </Box>
      </Box>
    </Container>
  );
}