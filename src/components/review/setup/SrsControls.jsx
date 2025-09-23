import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

export default function SrsControls(
  {
    dueCardsCount,
    unseenCount,
    dueLimit,
    newCount,
    onDueLimitChange,
    onNewCountChange
  }
) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{mt: 2, mb: 4}}>
      <Stack direction={isMobile ? "column" : "row"} spacing={4}>
        <Box sx={{flex: 1}}>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
            <Typography variant="body2">
              Cartes dues (0–{dueCardsCount})
            </Typography>
            <Tooltip title="Cartes planifiées par le SRS pour aujourd'hui." arrow>
              <InfoOutlinedIcon sx={{fontSize: 16}}/>
            </Tooltip>
          </Box>

          <Slider
            value={dueLimit}
            onChange={(_, newValue) => onDueLimitChange(newValue)}
            min={0}
            max={dueCardsCount}
            valueLabelDisplay="auto"
            aria-label="Nombre de cartes dues"
            disabled={dueCardsCount === 0}
            marks={[
              {value: 0, label: '0'},
              {value: dueCardsCount, label: String(dueCardsCount)}
            ]}
          />
        </Box>

        <Box sx={{flex: 1}}>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
            <Typography variant="body2">
              Nouvelles cartes (0–{unseenCount})
            </Typography>
            <Tooltip title="Cartes jamais revues qui seront ajoutées en plus des cartes dues." arrow>
              <InfoOutlinedIcon sx={{fontSize: 16}}/>
            </Tooltip>
            {unseenCount > 0 && (
              <Badge badgeContent={unseenCount} color="secondary" sx={{ml: 1}}/>
            )}
          </Box>

          <Slider
            value={newCount}
            onChange={(_, newValue) => onNewCountChange(newValue)}
            min={0}
            max={unseenCount}
            valueLabelDisplay="auto"
            aria-label="Nombre de cartes nouvelles"
            disabled={unseenCount === 0}
            marks={[
              {value: 0, label: '0'},
              {value: unseenCount, label: String(unseenCount)}
            ]}
          />
        </Box>
      </Stack>

      <Box sx={{mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1}}>
        <Typography variant="body2" color="text.secondary">
          Total
          sélectionné: <strong>{Math.min(dueLimit, dueCardsCount)} dues</strong> + <strong>{Math.min(newCount, unseenCount)} nouvelles</strong> = <strong>{Math.min(dueLimit, dueCardsCount) + Math.min(newCount, unseenCount)} cartes</strong>
        </Typography>
      </Box>
    </Box>
  );
}
