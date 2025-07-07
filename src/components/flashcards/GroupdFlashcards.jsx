import React, { useState } from 'react';
import OutlinedCard from "./flashcard";
import { Box, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import LayersIcon from '@mui/icons-material/Layers';

export default function CardGroup({ cards }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggleGroup = () => setIsOpen(prev => !prev);

  return (
    <Box sx={{ my: 2 }}>
      {isOpen ? (
        <Grid container spacing={3}>
          {cards.map((card, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={index}
              sx={{ display: 'flex', justifyContent: 'center', py: 2 }}
            >
              <Box sx={{ width: '100%', maxWidth: 340, p: 2 }}>
                <OutlinedCard {...card} />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          onClick={handleToggleGroup}
          className="card-group"
          sx={{
            position: 'relative',
            width: 300,
            height: 300,
            cursor: 'pointer',
          }}
        >
          {[...cards.slice(0, 3)].map((card, i) => {
            const reversedIndex = 2 - i;
            const showBadge = i === 0;

            return (
              <Box
                key={i}
                className={`card card-${reversedIndex}`}
                sx={{
                  position: 'absolute',
                  top: `${reversedIndex * 15}px`,
                  left: `${reversedIndex * 10}px`,
                  zIndex: reversedIndex,
                  filter: `brightness(${100 - reversedIndex * 3}%)`,
                  transform: `scale(${1 - reversedIndex * 0.03})`,
                  borderRadius: 2,
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  {showBadge && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        height: 28,
                        width: 28,
                        borderRadius: '50%',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                      }}
                    >
                      +{cards.length - 3}
                    </Box>
                  )}
                  <OutlinedCard {...card} />
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {isOpen && (
        <Box textAlign="right" mt={1}>
          <IconButton onClick={handleToggleGroup}>
            <LayersIcon />
          </IconButton>
        </Box>
      )}

      {/* CSS vague du haut vers le bas */}
      <style>
        {`
          .card-group:hover .card-2 {
            transform: scale(1.05) translateY(-10px);
            box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
            transition-delay: 0s;
          }
          .card-group:hover .card-1 {
            transform: scale(1.03) translateY(-6px);
            box-shadow: 0px 4px 12px rgba(0,0,0,0.15);
            transition-delay: 0.1s;
          }
          .card-group:hover .card-0 {
            transform: scale(1.01) translateY(-3px);
            box-shadow: 0px 3px 9px rgba(0,0,0,0.1);
            transition-delay: 0.2s;
          }
        `}
      </style>
    </Box>
  );
}
