import {createTheme} from '@mui/material/styles';

export const appTheme = createTheme({
  colorSchemes: {
    dark: true,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#2E7D32',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  },
  components: {
    // Exemple : arrondis XXL sur tous les Paper
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '1.5rem',
        },
      },
    },
  },
});
