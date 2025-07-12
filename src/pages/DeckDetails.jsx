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
import OutlinedCard from '../components/flashcards/flashcard.jsx'
import axios from 'axios'
import {useAuth} from '../context/AuthContext'

export default function DeckDetails() {
  const {id} = useParams()
  const [deck, setDeck] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const {isAuthenticated} = useAuth()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_API_URL}/decks/${id}`)
      .then(({data}) => {
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress/>
      </Box>
    )
  }

  if (error || !deck) {
    return (
      <Container maxWidth="md" sx={{mt: 8, textAlign: 'center'}}>
        <Typography variant="h5" color="error.main">Erreur lors du chargement du deck</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{mt: 4, mb: 6}}>
      {/* Header deck */}
      <Box mb={4} textAlign="center">
        <Typography variant="h3" gutterBottom>
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
              >
                Réviser
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Cartes */}
      <Grid container spacing={2}>
        {deck.cards?.map((card, idx) => {
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
              />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  )
}
