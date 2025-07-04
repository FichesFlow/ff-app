import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {Link} from 'react-router';

export default function AccountPrompt() {
  return (
    <Box width="100%" mt={4} border="1px solid #e0e0e0" borderRadius={2} p={4} bgcolor="">
      <Typography variant="subtitle1" sx={{width: '100%'}}>
        Retrouvez toutes vos fiches et débloquez des fonctionnalités supplémentaires en créant un compte&nbsp;!
      </Typography>
      <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} justifyContent="center" mt={2}>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          size="medium"
          sx={{minWidth: 120}}
        >
          Inscription
        </Button>
        <Button
          component={Link}
          to="/login"
          variant="outlined"
          size="medium"
          sx={{minWidth: 120}}
        >
          Connexion
        </Button>
      </Stack>
    </Box>
  );
}