import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MDEditor from "@uiw/react-md-editor";

export default function OutlinedCard({ sujet, niveau, theme, description_recto, description_verso }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(prev => !prev); //Inverse l'état de la carte
  };

  return (
    <Box sx={{ perspective: '1000px', width: 300, height: 300 }}>  
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          margin: 0,
          justifyContent: 'center',
          padding: "2px 2px 3px 0px",
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Recto */}
        <Card
          variant="outlined"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 2,
          }}
        >
          <CardContent sx={{ padding: '0px' }}>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 20 }}>
              {sujet}
            </Typography>
            <Typography variant="h5" component="div">
              {niveau} <Box component="span" sx={{ mx: '2px' }}>•</Box> {theme}
            </Typography>
            <Box sx={{ mt: 1, maxHeight: '185px', overflowY: 'scroll'}}>
              <MDEditor.Markdown source={description_recto || 'Description non fournie.'} 
              style={{
                backgroundColor: 'transparent',
                color: '#000',
                whiteSpace: 'pre-wrap' 
                }}/>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-start' }}>
            {description_verso && (
            <Button size="small" onClick={handleFlip} sx={{margin: '-9px'}}>Voir le verso</Button>
            )}
          </CardActions>
        </Card>

        {/* Verso */}
        <Card
          variant="outlined"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 2,
            margin: 0
          }}
        >
          <CardContent sx={{ padding: '0px' }}>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 20 }}>
              {sujet}
            </Typography>
            <Typography variant="h5" component="div">
              {niveau} <Box component="span" sx={{ mx: '2px' }}>•</Box> {theme}
            </Typography>
            <Box sx={{ mt: 1, maxHeight: '185px', overflowY: 'scroll' }}>
            <MDEditor.Markdown
            source={description_verso || 'Description non fournie.'}
            style={{
            backgroundColor: 'transparent',
            color: '#000',
            whiteSpace: 'pre-wrap',
            }}
            />
          </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-start' }}>
            <Button size="small" onClick={handleFlip} sx={{margin: '-9px'}}>Retourner</Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
}
