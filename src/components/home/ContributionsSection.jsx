import {Box, Button, Card, CardContent, Stack, Typography} from '@mui/material';
import {Link} from 'react-router';

export default function ContributionsSection() {
  // TODO: remplacer par données API (limit 3‑5)
  const contributions = [
    {id: 'a1', title: 'Théorème de Pythagore'},
    {id: 'b2', title: 'Intégrales fondamentales'},
    {id: 'c3', title: 'Lois de Newton'},
  ];

  return (
    <Box width="100%" maxWidth={800} textAlign="left">
      <Typography variant="h5" gutterBottom>
        Vos contributions récentes
      </Typography>

      {/* Historique rapide */}
      <Stack spacing={2} mb={2}>
        {contributions.map(({id, title}) => (
          <Card key={id} variant="outlined">
            <CardContent sx={{py: 1.5}}>
              <Typography variant="subtitle1" noWrap>
                <Link
                  to={`/notes/${id}`}
                  style={{textDecoration: 'none', color: 'inherit'}}
                >
                  {title}
                </Link>
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
        <Button
          component={Link}
          to="/decks/new"
          variant="contained"
          fullWidth
        >
          Créer une nouvelle fiche
        </Button>
        <Button
          component={Link}
          to="/contributions"
          variant="outlined"
          fullWidth
        >
          Voir toutes mes contributions
        </Button>
      </Stack>
    </Box>
  );
}
