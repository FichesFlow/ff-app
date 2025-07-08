import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {Radio, RadioGroup, Select, ToggleButton, ToggleButtonGroup} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function DeckInfos(
  {
    language,
    setLanguage,
    visibility,
    setVisibility,
    status,
    setStatus
  }
) {
  return (
    <Box bgcolor="#fff" p={3} borderRadius={1} boxShadow={3} mb={4}>
      <Typography variant="h5" gutterBottom>
        Informations sur le deck
      </Typography>
      <Stack spacing={2}>
        {/* Titre */}
        <TextField label="Titre" name="title" required fullWidth placeholder="Ex. Analyse – Suites"/>

        {/* Description */}
        <TextField
          label="Description (optionnel)"
          name="description"
          fullWidth
          multiline
          rows={3}
          placeholder="Court résumé pour la galerie…"
        />

        {/* Langue, Visibilité, Statut */}
        <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
          {/* Langue */}
          <FormControl fullWidth>
            <FormLabel id="deck-lang-label">Langue</FormLabel>
            <Select
              labelId="deck-lang-label"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
            </Select>
          </FormControl>

          {/* Visibilité */}
          <FormControl fullWidth>
            <FormLabel id="deck-vis-label">Visibilité</FormLabel>
            <RadioGroup
              row
              aria-labelledby="deck-vis-label"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <FormControlLabel value="private" control={<Radio/>} label="Privé"/>
              <FormControlLabel value="group" control={<Radio/>} label="Promo"/>
              <FormControlLabel value="public" control={<Radio/>} label="Public"/>
            </RadioGroup>
          </FormControl>

          {/* Statut */}
          <FormControl fullWidth>
            <FormLabel id="deck-status-label">Statut</FormLabel>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={status}
              onChange={(_, v) => v && setStatus(v)}
            >
              <ToggleButton value="draft">Brouillon</ToggleButton>
              <ToggleButton value="published">Publié</ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Stack>
      </Stack>
    </Box>
  );
}