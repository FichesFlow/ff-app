import {Link} from 'react-router';
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import CardActions from "@mui/material/CardActions";

export default function DeckPreviewCard({deck}) {

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public':
        return 'Public';
      case 'private':
        return 'Privé';
      default:
        return visibility;
    }
  };
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <CardContent sx={{flexGrow: 1}}>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {deck.title}
        </Typography>
        <Typography
          variant="body2" color="text.secondary"
          sx={{mb: 2, height: 60, overflow: 'hidden', textOverflow: 'ellipsis'}}
        >
          {deck.description || "Aucune description"}
        </Typography>
        <Stack direction="row" spacing={1} sx={{mb: 1}}>
          <Chip
            label={deck.status}
            size="small"
            color={getStatusColor(deck.status)}
          />
          <Chip
            label={getVisibilityIcon(deck.visibility)}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`${deck.card_count || 0} fiches`}
            size="small"
            variant="outlined"
          />
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          component={Link}
          to={`/decks/${deck.id}`}
          startIcon={<VisibilityIcon/>}
        >
          Voir
        </Button>
        <Button
          size="small"
          component={Link}
          to={`/decks/${deck.id}/edit`}
          color="primary"
          startIcon={<EditIcon/>}
        >
          Modifier
        </Button>
      </CardActions>
    </Card>
  )
}