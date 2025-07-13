import Box from "@mui/material/Box";
import SchoolIcon from "@mui/icons-material/School";
import Typography from "@mui/material/Typography";

export default function HeroSection() {
  return (
    <Box component="section">
      <SchoolIcon sx={{fontSize: 96}} color="primary"/>

      <Typography variant="h3" component="h1" gutterBottom>
        Bienvenue sur FichesFlow
      </Typography>

      <Typography variant="h6" color="text.secondary" maxWidth={600}>
        Créez, partagez et révisez vos fiches de cours avec une touche de
        gamification. Boostez votre mémorisation grâce à la répétition espacée !
      </Typography>
    </Box>
  );
}