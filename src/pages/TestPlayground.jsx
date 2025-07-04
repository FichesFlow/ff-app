import {Container, Divider, Paper, Stack, Typography,} from '@mui/material';
import LoginButtonTest from "../components/auth/LoginButtonTest.jsx";
import LogoutButtonTest from "../components/auth/LogoutButtonTest.jsx";
import ColorModeToggle from "../components/ui/ColorModeToggle.jsx";

export default function TestPlayground() {
  return (
    <Container maxWidth="md" sx={{py: 6}}>
      <Paper elevation={4} sx={{p: {xs: 2, sm: 4}}}>
        <Typography variant="h4" gutterBottom>
          🛠️ Playground de composants
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Ajoute ici tes composants pour les tester sans impacter le reste de
          l'application.
        </Typography>

        <Divider sx={{mb: 4}}/>

        <PlayArea/>
      </Paper>
    </Container>
  );
}

/**
 * Composant interne servant de zone de drop‑in.
 * Remplace son contenu par ce que tu veux expérimenter.
 */
function PlayArea() {
  return (
    <Stack spacing={2}>
      <LoginButtonTest/>
      <LogoutButtonTest/>
      <ColorModeToggle />
    </Stack>
  );
}
