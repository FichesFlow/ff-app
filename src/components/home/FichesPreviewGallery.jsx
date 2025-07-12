import Typography from "@mui/material/Typography";
import {Link} from 'react-router';
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";
import OutlinedCard from "../flashcards/flashcard.jsx";
import Button from "@mui/material/Button";
import sampleFlashcards from "../flashcards/sampleFlashcards.json";

export default function FichesPreviewGallery() {
  const flashcards = sampleFlashcards.sort(() => 0.5 - Math.random()).slice(0, 9);

  return (
    <Box width="100%" textAlign="left" flex={1} mt={4}>
      <Typography variant="h5" component="h2" gutterBottom>
        Parcourir les fiches
      </Typography>

      <Grid container spacing={2} mt={4} justifyContent="center">
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <OutlinedCard
              sujet={flashcard.sujet}
              niveau={flashcard.niveau}
              theme={flashcard.theme}
              description_recto={flashcard.description_recto}
              description_verso={flashcard.description_verso}
            />
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" mt={3}>
        <Button
          component={Link}
          to="/decks"
          variant="contained"
          size="medium"
        >
          Voir plus de fiches
        </Button>
      </Box>
    </Box>
  );
}