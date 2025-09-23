import React, {useState} from 'react';
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
import {defaultSchema} from 'hast-util-sanitize';
import AudioPlayer from './Audio_Flashcards';

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
export function MarkdownViewer({source}) {
  return (
    <ReactMarkdown
      children={source}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
      components={{
        span: ({node, ...props}) => <span {...props} />, // Utilisation de span pour le style (le style <mark> pose trop de problème -> à cause des selctions dans le texte)
      }}
    />
  );
}

export default function OutlinedCard(
  {
    sujet,
    niveau,
    theme,
    description_recto,
    description_verso,
    nom,
    cardType = 'single',
    sx = {},
  }
) {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => setIsFlipped((p) => !p);

  const scrollBox = {mt: 1, maxHeight: 185, overflowY: 'auto'};
  const isSingleSide = cardType === 'single';

  return (
    <Box sx={{perspective: 1000, width: 300, height: 300}}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: (isFlipped && !isSingleSide) ? 'rotateY(180deg)' : 'rotateY(0deg)'
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
          <CardContent sx={{p: 0}}>
            <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 20}}>
              {sujet}
            </Typography>
            <Box sx={scrollBox}>
              <MarkdownViewer source={description_recto || 'Description non fournie.'}/>
            </Box>
          </CardContent>

          <CardActions sx={{p: 0, justifyContent: "space-between"}}>
            {!isSingleSide && description_verso && (
              <Button size="small" onClick={handleFlip}>Verso</Button>
            )}
            {isSingleSide && (
              <Typography variant="caption" sx={{color: "text.secondary"}}>
                Fiche simple
              </Typography>
            )}
            <AudioPlayer texte={description_recto}/> {/* Bouton écouter */}
            {/* Affichage du nom de l'user */}
            {nom && (
              <Typography variant="caption" sx={{color: "text.secondary"}}>
                {nom}
              </Typography>
            )}
          </CardActions>
        </Card>

        {/* -------- Verso (only for flashcards) -------- */}
        {!isSingleSide && (
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
              ...sx
            }}
          >
            <CardContent sx={{p: 0}}>
              <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 20}}>
                {sujet}
              </Typography>
              <Box sx={scrollBox}>
                <MarkdownViewer source={description_verso || 'Description non fournie.'}/>
              </Box>
            </CardContent>

            <CardActions sx={{p: 0, justifyContent: "space-between"}}>
              <Button size="small" onClick={handleFlip}>Recto</Button>
              <AudioPlayer texte={description_verso}/>{/* Bouton écouter */}
              {/* Affichage du nom de l'user */}
              {nom && (
                <Typography variant="caption" sx={{color: "text.secondary"}}>
                  {nom}
                </Typography>
              )}
            </CardActions>
          </Card>
        )}
      </Box>
    </Box>
  );
}
