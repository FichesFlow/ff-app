import React, {useEffect, useState} from 'react'
import {Link as RouterLink, useParams} from 'react-router'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import SchoolIcon from '@mui/icons-material/School'
import AddIcon from '@mui/icons-material/Add'
import OutlinedCard from '../components/flashcards/flashcard.jsx'
import {useAuth} from '../context/AuthContext'
import {toast, ToastContainer} from 'react-toastify'
import useTheme from "../hooks/useTheme.js";
import {addToRevisionQueue} from "../api/review.js";
import {useDocumentTitle} from "../hooks/useDocumentTitle.js";
import {fetchDeck} from '../api/deck'


export default function DeckDetails() {
  const {id} = useParams()
  const [deck, setDeck] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const {isAuthenticated} = useAuth()
  const [addingToQueue, setAddingToQueue] = useState(false)

  const currentTheme = useTheme();

  useDocumentTitle(
    loading
      ? "Chargement du deck..."
      : error || !deck
        ? "Erreur - Deck non trouvé"
        : `${deck.title} - Détails du deck`
  );

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    fetchDeck(id)
      .then((data) => {
        if (isMounted) {
          setDeck(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err)
          setLoading(false)
        }
      })
    return () => {
      isMounted = false
    }
  }, [id])

  const handleAddToQueue = async () => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour ajouter un deck à votre fil')
      return
    }

    setAddingToQueue(true)
    try {
      await addToRevisionQueue(id)
      toast.success("Deck ajouté à votre file de révision")
    } catch (err) {
      console.error('Error adding deck to queue:', err)
      const errorResponse = err.response?.data;
      if (err.response?.status === 400 && errorResponse?.detail?.includes("already in your review queue")) {
        toast.warning("Ce deck est déjà dans votre file de révision");
      } else {
        toast.error("Erreur lors de l'ajout du deck à votre file de révision");
      }
    } finally {
      setAddingToQueue(false)
    }
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={8}
        role="status"
        aria-label="Chargement du deck"
      >
        <CircularProgress aria-hidden="true"/>
      </Box>
    )
  }

  if (error || !deck) {
    return (
      <Container
        maxWidth="md"
        sx={{mt: 8, textAlign: 'center'}}
        role="alert"
      >
        <Typography variant="h5" color="error.main">Erreur lors du chargement du deck</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{mt: 4, mb: 6}}>
      <main aria-labelledby="deck-title">
        {/* Header deck */}
        <Box mb={4} textAlign="center">
          <Typography variant="h3" gutterBottom id="deck-title">
            {deck.title}
          </Typography>
          {deck.description && (
            <Typography variant="subtitle1" color="text.secondary">
              {deck.description}
            </Typography>
          )}
          <Box mt={2} display="flex" justifyContent="center" gap={2}>
            <Button
              component={RouterLink}
              to={`/decks/${id}/edit`}
              variant="contained"
              size="small"
              aria-label={`Éditer le deck ${deck.title}`}
            >
              Éditer le deck
            </Button>

            <Tooltip
              title={isAuthenticated ? "" : "Connectez-vous pour réviser ce deck"}
              arrow
            >
              <span>
                <Button
                  component={RouterLink}
                  to={isAuthenticated ? `/review?deck=${id}` : "#"}
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<SchoolIcon/>}
                  disabled={!isAuthenticated}
                  aria-label={`Réviser le deck ${deck.title}`}
                >
                  Réviser
                </Button>
              </span>
            </Tooltip>

            <Tooltip
              title={isAuthenticated ? "" : "Connectez-vous pour ajouter ce deck à votre file de révision"}
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon/>}
                  disabled={!isAuthenticated || addingToQueue}
                  onClick={handleAddToQueue}
                  aria-label={`Ajouter le deck ${deck.title} à ma file de révision`}
                  aria-busy={addingToQueue}
                >
                  {addingToQueue ? 'Ajout en cours...' : 'Ajouter à ma file de révision'}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>

        <section aria-label="Fiches du deck">
          <Typography variant="h5" component="h2" sx={{mb: 2, visually: 'hidden'}}>
            Fiches du deck
          </Typography>
          <Grid container spacing={2}>
            {deck.cards?.length > 0 ? (
              deck.cards.map((card, idx) => {
                const frontSide = card.cardSides.find(side => side.side === "front");
                const backSide = card.cardSides.find(side => side.side === "back");

                const frontContent = frontSide?.cardBlock?.content || "";
                const backContent = backSide?.cardBlock?.content || null;

                return (
                  <Grid item key={idx} xs={12} sm={6} md={4}>
                    <OutlinedCard
                      sujet={deck.title}
                      description_recto={frontContent}
                      description_verso={backContent}
                      aria-label={`Fiche ${idx + 1} du deck ${deck.title}`}
                    />
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" align="center">
                  Ce deck ne contient pas encore de fiches.
                </Typography>
              </Grid>
            )}
          </Grid>
        </section>
      </main>
      <ToastContainer
        position="bottom-right"
        role="alert"
        aria-live="polite"
        theme={currentTheme === 'dark' ? 'dark' : 'light'}
      />
    </Container>
  )
}