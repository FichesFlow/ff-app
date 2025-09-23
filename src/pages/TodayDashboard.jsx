import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {getDue} from '../api/review';
import {
  Alert,
  Badge,
  Box, Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function TodayDashboard() {
  const [dueData, setDueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getDue()
      .then((data) => {
        if (isMounted) {
          setDueData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleStartReview = () => {
    if (!dueData || dueData.total === 0) return;

    // Find the first deck with due cards
    const deckWithDueCards = dueData.decks.find(deck => deck.due > 0);

    if (deckWithDueCards) {
      navigate('/review/session', {
        state: {
          mode: 'flashcard',
          cardSource: 'due',
        }
      });
    }
  };

  const hasDueCards = dueData && dueData.total > 0;

  return (
    <Box sx={{maxWidth: 600, mx: 'auto', mt: 4, p: 2}}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord du jour
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Bienvenue sur votre tableau de bord quotidien !
      </Typography>
      {loading && (
        <Box sx={{display: 'flex', justifyContent: 'center', my: 4}}>
          <CircularProgress/>
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{my: 2}}>
          Erreur lors du chargement des cartes dues.
        </Alert>
      )}
      {dueData && (
        <Paper elevation={2} sx={{p: 3, mt: 2}}>
          <Typography variant="h6" gutterBottom>
            Total de cartes à réviser aujourd'hui :{' '}
            <Badge
              badgeContent={dueData.total}
              color={dueData.total > 0 ? 'error' : 'default'}
              sx={{ml: 2}}
            >
            </Badge>
          </Typography>
          <Divider sx={{my: 2}}/>
          <List>
            {dueData.decks.map((deck) => (
              <ListItem key={deck.id} sx={{py: 1}}>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                      {deck.title}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color={deck.due > 0 ? 'error.main' : 'text.secondary'}
                    >
                      {deck.due} carte{deck.due > 1 ? 's' : ''} à réviser
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
          {hasDueCards && (
            <Box sx={{mt: 3}}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<PlayArrowIcon/>}
                onClick={handleStartReview}
                sx={{py: 1.5}}
              >
                Commencer la révision
              </Button>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}