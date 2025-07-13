import {useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import {fetchDecks} from '../api/deck';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import DeckPreviewCard from "../components/deck/DeckPreviewCard.jsx";

export default function MyDecks() {
  useDocumentTitle('Mes Decks – FichesFlow');

  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMyDecks = async () => {
      try {
        setLoading(true);
        const response = await fetchDecks({mine: 1});
        setDecks(response['hydra:member'] || response || []);
      } catch (err) {
        console.error('Failed to fetch decks:', err);
        setError('Impossible de charger vos decks. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    getMyDecks();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{mt: 6, mb: 6, display: 'flex', justifyContent: 'center'}}>
        <CircularProgress/>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{mt: 4, mb: 6}}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mes Decks
        </Typography>
      </Box>
      <Box mb={2}>
        <Button
          component={RouterLink}
          to="/decks/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon/>}
        >
          Créer un deck
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{mb: 4}}>
          {error}
        </Alert>
      )}

      {!loading && decks.length === 0 && !error && (
        <Alert severity="info" sx={{mb: 4}}>
          Vous n'avez pas encore créé de decks. Cliquez sur "Créer un deck" pour commencer.
        </Alert>
      )}

      <Grid container spacing={3}>
        {decks.map((deck) => (
          <Grid item key={deck.id} xs={12} sm={6} md={4}>
            <DeckPreviewCard deck={deck} showEditButton={true} showMetadata={true}/>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}