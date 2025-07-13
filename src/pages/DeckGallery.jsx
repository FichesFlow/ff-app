import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {fetchDecks} from '../api/deck';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import DeckPreviewCard from "../components/deck/DeckPreviewCard.jsx";

export default function DeckGallery() {
  useDocumentTitle('Galerie de Decks – FichesFlow');

  const [searchParams, setSearchParams] = useSearchParams({page: 1});
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 30;

  useEffect(() => {
    const loadDecks = async () => {
      try {
        setLoading(true);
        const response = await fetchDecks({
          page: currentPage,
          visibility: 'public',
          status: 'published',
          itemsPerPage
        }, {
          headers: {
            'Accept': 'application/ld+json'
          }
        });

        setDecks(response['member'] || []);

        // Handle pagination data from API response
        if (response['totalItems']) {
          setTotalItems(response['totalItems']);
          setTotalPages(Math.ceil(response['totalItems'] / itemsPerPage));
        } else if (Array.isArray(response)) {
          setTotalItems(response.length);
          setTotalPages(Math.ceil(response.length / itemsPerPage));
        }
      } catch (err) {
        console.error('Failed to fetch decks:', err);
        setError('Impossible de charger les decks. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadDecks();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (event, value) => {
    setSearchParams({page: value});
    window.scrollTo(0, 0);
  };

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
          Galerie de Decks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Découvrez tous les decks publics créés par la communauté
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{mb: 4}}>
          {error}
        </Alert>
      )}

      {!loading && decks.length === 0 && !error && (
        <Alert severity="info" sx={{mb: 4}}>
          Aucun deck public n'a été trouvé.
        </Alert>
      )}

      <Grid container spacing={3}>
        {decks.map((deck) => (
          <Grid item key={deck.id} xs={12} sm={6} md={4}>
            <DeckPreviewCard deck={deck}/>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Stack spacing={2} sx={{mt: 4}} alignItems="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} sur {totalPages} ({totalItems} decks au total)
          </Typography>
        </Stack>
      )}
    </Container>
  );
}