import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// yarn add react-markdown remark-gfm rehype-raw rehype-sanitize hast-util-sanitize 
// (librairies pour le rendu markdown compatible avec MDXEditor)
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { defaultSchema } from 'hast-util-sanitize';

// schema du style sur <mark> & <span> 
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    mark: [...(defaultSchema.attributes?.mark || []), 'style'],
    span: [...(defaultSchema.attributes?.span || []), 'style'],
  },
};
// fonction permettant de visualiser le markdown en prenant en compte la source et appliquant le schema
function MarkdownViewer({ source }) {
  return (
    <ReactMarkdown
      children={source}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
      components={{
        span: ({ node, ...props }) => <span {...props} />, // Utilisation de span pour le style (le style <mark> pose trop de problème -> à cause des selctions dans le texte)
      }}
    />
  );
}
export default function OutlinedCard({
  sujet,
  niveau,
  theme,
  description_recto,
  description_verso,
  sx = {},
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => setIsFlipped((p) => !p); //Inverse l'état de la carte

  const scrollBox = { mt: 1, maxHeight: 185, overflowY: 'auto' };

  return (
    <Box sx={{ perspective: 1000, width: 300, height: 300 }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* -------- Recto -------- */}
        <Card
          variant="outlined"
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 2,
            ...sx
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 20 }}>
              {sujet}
            </Typography>
            <Typography variant="h5">
              {niveau} <Box component="span" sx={{ mx: 1 }}>•</Box> {theme}
            </Typography>
            <Box sx={scrollBox}>
              <MarkdownViewer source={description_recto || 'Description non fournie.'} />
            </Box>
          </CardContent>

          {description_verso && (
            <CardActions sx={{ p: 0 }}>
              <Button size="small" onClick={handleFlip}>Voir le verso</Button>
            </CardActions>
          )}
        </Card>

        {/* -------- Verso -------- */}
        <Card
          variant="outlined"
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 2,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 20 }}>
              {sujet}
            </Typography>
            <Typography variant="h5">
              {niveau} <Box component="span" sx={{ mx: 1 }}>•</Box> {theme}
            </Typography>
            <Box sx={scrollBox}>
              <MarkdownViewer source={description_verso || 'Description non fournie.'} />
            </Box>
          </CardContent>

          <CardActions sx={{ p: 0 }}>
            <Button size="small" onClick={handleFlip}>Retourner</Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
}
