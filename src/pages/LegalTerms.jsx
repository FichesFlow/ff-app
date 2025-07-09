// src/pages/LegalTerms.jsx
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const sections = [
  { id: 'objet', title: '1. Objet' },
  { id: 'conditions', title: '2. Acceptation des conditions' },
  { id: 'utilisation', title: '3. Utilisation du service' },
  { id: 'propriete', title: '4. Propriété intellectuelle' },
  { id: 'responsabilite', title: '5. Responsabilité' },
  { id: 'droit', title: '6. Droit applicable' }
];

export default function LegalTerms() {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      {/* Sommaire desktop uniquement */}
      {isSmUp && (
        <Box
          component="nav"
          sx={{
            position: 'fixed',
            top: 80,
            left: 0,
            width: 240,
            height: 'calc(100vh - 80px)',
            overflowY: 'auto',
            p: 2,
            borderRight: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" gutterBottom>Sommaire</Typography>
          <Box component="ul" sx={{ listStyle: 'none', pl: 0, m: 0 }}>
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`#${section.id}`}
                  underline="hover"
                  color="primary"
                  sx={{ display: 'block', py: 0.5 }}
                >
                  {section.title}
                </Link>
              </li>
            ))}
          </Box>
        </Box>
      )}

      {/* Contenu principal */}
      <Container
        maxWidth="md"
        sx={{
          ml: { sm: '260px' },  // décale le contenu quand le sommaire est visible
          px: { xs: 2, sm: 3 },
          py: 4,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Conditions Générales d’Utilisation
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {sections.map((section) => (
          <Box key={section.id} id={section.id} sx={{ mb: 6 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {section.title}
            </Typography>
            <Typography paragraph>
              {getCGUContent(section.id)}
            </Typography>
          </Box>
        ))}
      </Container>
    </Box>
  );
}

// 🔹 Contenu type CGU (simplifié)
function getCGUContent(id) {
  switch (id) {
    case 'objet':
      return "Les présentes Conditions Générales d’Utilisation ont pour objet de définir les modalités de mise à disposition du site FichesFlow, ainsi que les conditions d’utilisation du service par l’utilisateur.";
    case 'conditions':
      return "L’utilisation du site implique l’acceptation pleine et entière des présentes conditions. Celles-ci peuvent être modifiées à tout moment, les utilisateurs sont donc invités à les consulter régulièrement.";
    case 'utilisation':
      return "L’utilisateur s’engage à utiliser le site de manière conforme aux lois en vigueur et à ne pas porter atteinte aux droits des tiers ou à l’ordre public.";
    case 'propriete':
      return "L’ensemble du contenu présent sur le site (textes, images, logos, etc.) est protégé par le droit de la propriété intellectuelle et reste la propriété exclusive de FichesFlow.";
    case 'responsabilite':
      return "FichesFlow ne saurait être tenu responsable des dommages directs ou indirects causés au matériel de l’utilisateur lors de l’accès au site.";
    case 'droit':
      return "Les présentes conditions sont régies par le droit français. En cas de litige, compétence exclusive est attribuée aux tribunaux français.";
    default:
      return "";
  }
}
