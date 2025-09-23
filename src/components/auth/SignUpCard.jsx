import {useState} from 'react';
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Link from '@mui/material/Link';
import {Link as RouterLink, useNavigate} from 'react-router';
import {AuthContainer} from "../shared/AuthContainer.jsx";
import {AuthCard} from "../shared/AuthCard.jsx";
import {toast} from 'react-toastify';
import {useAuth} from "../../context/AuthContext.jsx";

export default function SignUpCard() {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');

  const {register, loading} = useAuth();
  const navigate = useNavigate();

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const username = document.getElementById('username');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Veuillez entrer une adresse email valide.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage('Le mot de passe doit contenir au moins 8 caractères.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!username.value || username.value.length < 1) {
      setUsernameError(true);
      setUsernameErrorMessage('Nom d’utilisateur requis.');
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage('');
    }

    return isValid;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (usernameError || emailError || passwordError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    try {
      await register(data.get('email'), data.get('password'), data.get('username'));
      toast.success('Compte créé avec succès!');
      navigate("/login");
    } catch {
      toast.error('Échec de la création du compte. Veuillez réessayer.');
    }
  };

  return (
    <AuthContainer direction="column" justifyContent="space-between">
      <AuthCard variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
        >
          Créer un compte
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{display: 'flex', flexDirection: 'column', gap: 2}}
        >
          <FormControl>
            <FormLabel htmlFor="username">Nom d'utilisateur</FormLabel>
            <TextField
              autoComplete="username"
              name="username"
              required
              fullWidth
              id="username"
              placeholder="user123"
              error={usernameError}
              helperText={usernameErrorMessage}
              color={usernameError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              required
              fullWidth
              id="email"
              placeholder="votre@email.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              error={emailError}
              helperText={emailErrorMessage}
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Mot de Passe</FormLabel>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="acceptCGU" color="primary"/>}
            label={
              <>
                J’accepte les Conditions d’utilisation{' '}
                <Link
                  component={RouterLink}
                  to="/legal/terms"
                  target="_blank"
                  rel="noopener"
                  underline="always"
                  sx={{color: 'text.primary'}}
                >
                  (CGU)
                </Link>
              </>
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            {loading ? 'Création du compte...' : 'Créer un compte'}
          </Button>
        </Box>
        <Divider>
          <Typography sx={{color: 'text.secondary'}}>ou</Typography>
        </Divider>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
          <Typography sx={{textAlign: 'center'}}>
            Déjà un compte ?{' '}
            <Link
              component={RouterLink}
              to="/login/"
              variant="body2"
              sx={{alignSelf: 'center', color: 'text.primary'}}
            >
              Connexion
            </Link>
          </Typography>
        </Box>
      </AuthCard>
    </AuthContainer>
  );
}
