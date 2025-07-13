import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import {Grid} from "@mui/material";
import Button from "@mui/material/Button";
import {Link} from 'react-router';

export default function StatsLeaderboard() {
  return (
    <Card variant="outlined" sx={{width: '100%', maxWidth: 600}}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Vos statistiques
        </Typography>
        <Grid container spacing={2} mb={2} justifyContent="center">
          <Grid item xs={4} textAlign="center">
            <Typography variant="h4">1 950</Typography>
            <Typography variant="body2" color="text.secondary">
              Points XP
            </Typography>
          </Grid>
          <Grid item xs={4} textAlign="center">
            <Typography variant="h4">2</Typography>
            <Typography variant="body2" color="text.secondary">
              Badges
            </Typography>
          </Grid>
          <Grid item xs={4} textAlign="center">
            <Typography variant="h4">4ᵉ</Typography>
            <Typography variant="body2" color="text.secondary">
              Classement
            </Typography>
          </Grid>
        </Grid>
        <Button component={Link} to="/leaderboard" variant="contained" fullWidth>
          Voir le leaderboard
        </Button>
      </CardContent>
    </Card>)
}