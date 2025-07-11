import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Avatar, Box, Link } from '@mui/material';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

const teamMembers = [
  { name: 'Mina Zakhary', role: 'Project Manager', photo: '/assets/team/alice.jpg' },
  { name: 'Nicolas Speich', role: 'Product Owner', photo: '/assets/team/bob.jpg' },
  { name: 'Mysterken', role: 'Chief technical officer', photo: '/assets/team/claire.jpg' },
  { name: 'Rayan Atrouni', role: 'Front-end developer', photo: '/assets/team/david.jpg' },
  { name: 'Patick Pucelj', role: 'Back-end developer', photo: '/assets/team/eric.jpg' },
];

export default function About() {

   useDocumentTitle('À propos – FichesFlow');

  return (
    <>
    <meta name="description" content="En savoir plus sur notre mission, notre équipe et nos technologies utilisées" />
    <Container maxWidth="md" component="main" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        À propos
      </Typography>

      {/* Mission */}
      <Box component="section" aria-label="Notre mission" sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Notre mission
        </Typography>
        <Typography paragraph>
          Chez FichesFlow, notre mission est de fournir une plateforme intuitive
          pour simplifier la gestion de vos projets, grâce à des fiches claires et
          une interface réactive. Nous croyons au pouvoir de la collaboration et
          de la simplicité.
        </Typography>
      </Box>

      {/* Équipe */}
      <Box component="section" aria-label="L’équipe" sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          L’équipe
        </Typography>
        <Grid container spacing={2}>
          {teamMembers.map((member) => (
            <Grid
              item
              key={member.name}
              xs={12}
              md={6}
              aria-label={`${member.name}, ${member.role}`}
            >
              <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Avatar
                  src={member.photo}
                  alt={member.name}
                  sx={{ width: 64, height: 64, mr: 2 }}
                />
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6">{member.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Technologies utilisées */}
      <Box component="section" aria-label="Technologies utilisées" sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Technologies utilisées
        </Typography>
        <Grid container spacing={1} component="ul" sx={{ listStyle: 'none', pl: 0 }}>
          {['React', 'Symfony', 'PostgreSQL', 'MUI', 'Docker', 'Github Workflow'].map((tech) => (
            <Grid item key={tech} component="li">
              <Typography variant="body1">• {tech}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
    </>
  );
}


