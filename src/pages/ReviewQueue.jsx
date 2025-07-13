import {useEffect, useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import {getMyReviewQueues, removeFromRevisionQueue} from '../api/review';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import useTheme from "../hooks/useTheme.js";
import {format} from 'date-fns';
import {fr} from 'date-fns/locale';
import {toast, ToastContainer} from 'react-toastify';
import {useAuth} from "../context/AuthContext.jsx";

// Helper functions remain unchanged
const translatePriority = (priority) => {
  const translations = {
    'normal': 'Normale',
    'intense': 'Intense'
  };
  return translations[priority] || priority;
};

const getPriorityColor = (priority) => {
  const colors = {
    'normal': 'info',
    'intense': 'warning'
  };
  return colors[priority] || 'default';
};

export default function ReviewQueue() {
  useDocumentTitle('File de révision – FichesFlow');

  const [queueItems, setQueueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState(null);
  const currentTheme = useTheme();
  const {isAuthenticated} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {replace: true});
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchQueue = async () => {
      try {
        setLoading(true);
        const response = await getMyReviewQueues();
        setQueueItems(response['hydra:member'] || response || []);
      } catch (err) {
        console.error('Failed to fetch review queue:', err);
        setError('Impossible de charger votre file de révision. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, [isAuthenticated]);

  const handleRemoveFromQueue = async (queueItemId) => {
    if (removing) return;

    setRemoving(queueItemId);
    try {
      await removeFromRevisionQueue(queueItemId);
      setQueueItems(queueItems.filter(item => item.id !== queueItemId));
      toast.success("Deck retiré de votre file de révision");
    } catch (err) {
      console.error('Failed to remove from queue:', err);
      toast.error("Erreur lors de la suppression de ce deck de votre file");
    } finally {
      setRemoving(null);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={8}
        role="status"
        aria-label="Chargement de la file de révision"
      >
        <CircularProgress aria-hidden="true"/>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{mt: 4, mb: 6}}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Ma file de révision
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gérez vos decks à réviser et commencez une session quand vous êtes prêt.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{mb: 4}} role="alert">
          {error}
        </Alert>
      )}

      {!loading && queueItems.length === 0 && !error && (
        <Box textAlign="center" my={6}>
          <Alert severity="info" sx={{mb: 4}} role="status">
            Votre file de révision est vide.
          </Alert>
          <Button
            component={RouterLink}
            to="/decks"
            variant="contained"
            color="primary"
            startIcon={<SearchIcon/>}
            aria-label="Découvrir des decks à ajouter à votre file de révision"
          >
            Découvrir des decks
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {queueItems.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <Card
              sx={{height: '100%', display: 'flex', flexDirection: 'column'}}
              aria-labelledby={`queue-item-${item.id}`}
            >
              <CardContent sx={{flexGrow: 1}}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  id={`queue-item-${item.id}`}
                >
                  {item.deck.title}
                </Typography>
                {item.deck.description && (
                  <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                    {item.deck.description}
                  </Typography>
                )}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Chip
                    label={`${item.deck.card_count} fiches`}
                    size="small"
                    aria-label={`${item.deck.card_count} fiches dans ce deck`}
                  />
                  <Chip
                    label={translatePriority(item.priority)}
                    color={getPriorityColor(item.priority)}
                    size="small"
                    aria-label={`Priorité: ${translatePriority(item.priority)}`}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Ajouté le {format(new Date(item.added_at), 'dd MMMM yyyy', {locale: fr})}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={RouterLink}
                  to={`/review?deck=${item.deck.id}`}
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<SchoolIcon/>}
                  aria-label={`Réviser le deck ${item.deck.title}`}
                >
                  Réviser
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleRemoveFromQueue(item.id)}
                  disabled={removing === item.id}
                  aria-label={`Retirer ${item.deck.title} de la file de révision`}
                  aria-busy={removing === item.id}
                >
                  {removing === item.id ? 'Suppression...' : 'Retirer'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ToastContainer position="bottom-right" theme={currentTheme === 'dark' ? 'dark' : 'light'}/>
    </Container>
  );
}