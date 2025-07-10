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
import ForgotPassword from "./ForgotPassword.jsx";
import {toast, ToastContainer} from 'react-toastify';
import {useAuth} from "../../context/AuthContext.jsx";
import useTheme from '../../hooks/useTheme';

export default function SignInCard() {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);

  const {login, loading} = useAuth();
  const currentTheme = useTheme();
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Veuillez entrer une adresse email valide.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value) {
      setPasswordError(true);
      setPasswordErrorMessage('Le mot de passe est requis.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (emailError || passwordError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    try {
      await login(data.get('email'), data.get('password'));
      toast.success('Connexion réussie!', {
        position: "bottom-right",
        theme: currentTheme === 'dark' ? 'dark' : 'light'
      });
      navigate("/");
    } catch {
      toast.error('Échec de la connexion. Vérifiez vos identifiants.', {
        position: "bottom-right",
        theme: currentTheme === 'dark' ? 'dark' : 'light'
      });
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
          Connexion
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{display: 'flex', flexDirection: 'column', gap: 2}}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="votre@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Mot de Passe</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary"/>}
            label="Se souvenir de moi"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
          <ForgotPassword open={open} handleClose={handleClose}/>
          <Link
            component="button"
            type="button"
            onClick={handleClickOpen}
            variant="body2"
            sx={{alignSelf: 'center', color: 'text.primary'}}
          >
            Mot de passe oublié ?
          </Link>
        </Box>
        <Divider>
          <Typography sx={{color: 'text.secondary'}}>ou</Typography>
        </Divider>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
          <Typography sx={{textAlign: 'center'}}>
            Pas de compte ?{' '}
            <Link
              component={RouterLink}
              to="/register/"
              variant="body2"
              sx={{alignSelf: 'center', color: 'text.primary'}}
            >
              S'inscrire
            </Link>
          </Typography>
        </Box>
      </AuthCard>
      <ToastContainer/>
    </AuthContainer>
  );
}
