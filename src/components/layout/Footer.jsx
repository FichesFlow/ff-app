import {Box, Container, Divider, Link as MuiLink, Stack, Typography} from '@mui/material';
import {Link} from 'react-router';

export default function Footer() {
  return (
    <Box component="footer" sx={{py: 4, mt: 'auto'}}>
      <Container maxWidth="lg">
        <Stack
          direction={{xs: 'column', sm: 'row'}}
          spacing={{xs: 1.5, sm: 3}}
          justifyContent="center"
          alignItems="center"
        >
          <FooterLink to="/legal/terms">Conditions générales</FooterLink>
          <FooterLink to="/legal/privacy">Politique de confidentialité</FooterLink>

          <Divider orientation="vertical" flexItem sx={{display: {xs: 'none', sm: 'block'}}}/>

          <FooterLink to="/about">À propos</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
        </Stack>

        <Typography variant="caption" color="text.secondary" display="block" align="center" mt={2}>
          © {new Date().getFullYear()} FichesFlow • Tous droits réservés
        </Typography>
      </Container>
    </Box>
  );
}

function FooterLink({to, children}) {
  return (
    <MuiLink
      component={Link}
      to={to}
      color="text.secondary"
      underline="hover"
      sx={{fontSize: '0.875rem', fontWeight: 500}}
    >
      {children}
    </MuiLink>
  );
}
