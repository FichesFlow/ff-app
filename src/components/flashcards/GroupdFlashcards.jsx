// CardGroup.jsx
import React, { useState } from 'react';
//import OutlinedCard from './OutlinedCard';
import OutlinedCard from "./flashcard";
import { Box, Typography, Badge, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import LayersIcon from '@mui/icons-material/Layers';

export default function CardGroup({ cards }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleGroup = () => setIsOpen(prev => !prev);

  // Pour créer un effet "dessiné", on applique de légers rotates aléatoires
  const getCardStyle = (index) => ({
    transform: `rotate(${Math.floor(Math.random() * 5 - 2.5)}deg)`,
    transition: 'transform 0.3s ease',
  });

  return (
    <Box sx={{ my: 2 }}>
      {isOpen ? (
        <Grid container spacing={2}>
          {cards.map((card, index) => (
           <Grid container spacing={2}>
  {cards.map((card, index) => (
    <Grid item xs={12} sm={6} key={index}>
      <Box>
        <OutlinedCard {...card} />
      </Box>
    </Grid>
  ))}
</Grid>
          ))}
        </Grid>
      ) : (
        <Box
          onClick={handleToggleGroup}
          sx={{
            position: 'relative',
            width: 300,
            height: 300,
            cursor: 'pointer',
          }}
        >
          {/* Simulation de pile */}
          {cards.slice(0, 3).map((card, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                top: i * 5,
                left: i * 5,
                zIndex: i,
                filter: 'brightness(95%)',
              }}
            >
              <OutlinedCard {...card} />
            </Box>
          ))}

          {/* Badge + nombre total */}
          <Badge
            badgeContent={`+${cards.length - 3}`}
            color="secondary"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 5,
            }}
          />
        </Box>
      )}

      {/* Bouton toggle */}
      {isOpen && (
        <Box textAlign="right" mt={1}>
          <IconButton onClick={handleToggleGroup}>
            <LayersIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}