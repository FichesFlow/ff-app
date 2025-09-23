import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { MarkdownViewer } from '../flashcards/flashcard';

export default function FlashCard({ card, showAnswer }) {
  const frontSide = card?.cardSides.find(side => side.side === "front");
  const backSide = card?.cardSides.find(side => side.side === "back");
  const frontContent = frontSide?.cardBlock?.content || "Pas de contenu";
  const backContent = backSide?.cardBlock?.content || "Pas de contenu";

  return (
    <Card elevation={3} sx={{ minHeight: 300, mb: 3 }}>
      <CardContent sx={{ height: '100%', p: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {showAnswer ? "Réponse" : "Question"}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ whiteSpace: 'pre-wrap' }}>
          <MarkdownViewer source={showAnswer ? backContent : frontContent} />
        </Box>
      </CardContent>
    </Card>
  );
}
