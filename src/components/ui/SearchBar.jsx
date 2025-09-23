import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {alpha, styled} from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import {getDeckSuggestions} from '../../api/deck_search';
import {toast} from 'react-toastify';

const Search = styled('div')(({theme}) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
}));

const StyledAutocomplete = styled(Autocomplete)(({theme}) => ({
  '& .MuiInputBase-root': {
    color: 'inherit',
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50ch',
    },
    '& .MuiInputBase-input': {
      padding: 0,
    },
  },
  '& .MuiAutocomplete-popupIndicator': {
    display: 'none',
  },
  '& .MuiAutocomplete-endAdornment': {
    right: theme.spacing(1),
  },
}));

export default function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputValue.trim().length < 2) {
      setOptions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await getDeckSuggestions(inputValue);
        setOptions(response.suggestions || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        toast.error('Erreur lors de la recherche');
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const handleOptionSelect = (event, value) => {
    if (value && value.id) {
      navigate(`/decks/${value.id}`);
      setInputValue('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      // Navigate to deck gallery with search query
      navigate(`/decks?search=${encodeURIComponent(inputValue)}`);
    }
  };

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon/>
      </SearchIconWrapper>
      <StyledAutocomplete
        freeSolo
        options={options}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
        filterOptions={(x) => x} // Don't filter, we handle filtering server-side
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={handleOptionSelect}
        loading={loading}
        renderInput={(params) => (
          <InputBase
            ref={params.InputProps.ref}
            inputProps={{
              ...params.inputProps,
              'aria-label': 'search',
              onKeyPress: handleKeyPress,
            }}
            placeholder="Rechercher une fiche…"
            endAdornment={
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                {loading && <CircularProgress color="inherit" size={20}/>}
                {params.InputProps.endAdornment}
              </Box>
            }
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            <Box>
              <Typography variant="body2" component="div">
                {option.title}
              </Typography>
              {option.description && (
                <Typography variant="caption" color="text.secondary">
                  {option.description.length > 60
                    ? `${option.description.substring(0, 60)}...`
                    : option.description}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        noOptionsText={
          inputValue.trim().length < 2
            ? "Tapez au moins 2 caractères"
            : "Aucun deck trouvé"
        }
      />
    </Search>
  );
}

