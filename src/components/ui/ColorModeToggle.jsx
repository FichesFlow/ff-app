import {useColorScheme} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';

export default function ColorModeToggle(props) {
  const {mode, setMode} = useColorScheme();

  const toggle = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
  };

  const title = mode === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair';

  return (
    <Tooltip title={title} arrow>
      <IconButton color="inherit" onClick={toggle} {...props}>
        {mode === 'light' ? <DarkModeRoundedIcon/> : <LightModeRoundedIcon/>}
      </IconButton>
    </Tooltip>
  );
}
