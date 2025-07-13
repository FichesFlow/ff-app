import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import LeaderboardTable from "../components/gamification/LeaderboardTable.jsx";
import UserRankCard from "../components/gamification/UserRankCard.jsx";
import {useDocumentTitle} from "../hooks/useDocumentTitle.js";

export default function Leaderboard() {
  useDocumentTitle("Classement des utilisateurs – FichesFlow");

  return (
    <Container maxWidth="lg" sx={{mt: 4, mb: 4, display: "flex", flexDirection: 'column', alignItems: 'center'}}>
      <Typography
        component="h1"
        variant="h4"
        sx={{fontSize: 'clamp(2rem, 10vw, 2.15rem)', mb: 2}}
      >
        Classement des utilisateurs
      </Typography>
      <LeaderboardTable/>
      <Grid item xs={12} md={4} mt={4}>
        <UserRankCard/>
      </Grid>
    </Container>
  );
}