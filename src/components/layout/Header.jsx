import {Link} from "react-router";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import SchoolIcon from '@mui/icons-material/School';
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {Avatar} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DueBadge from '../gamification/DueBadge'
import {useTodayDueCount} from '../../hooks/useTodayDueCount'
import SearchBar from '../ui/SearchBar.jsx';
import ColorModeToggle from '../ui/ColorModeToggle.jsx';

function HideOnScroll(props) {
  const {children} = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div/>}
    </Slide>
  );
}

export default function Header(props) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const {logout, isAuthenticated} = useAuth();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickLogout = () => {
    logout();
    handleCloseUserMenu();
  }

  const dueCount = useTodayDueCount();

  return (
    <>
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>

            <Link to="/" style={{textDecoration: 'none', color: 'inherit', display: "flex"}}>
              <SchoolIcon sx={{display: {md: 'flex'}, mr: 2, my: "auto"}}/>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: {xs: 'none', md: 'flex'},
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                FichesFlow
              </Typography>
            </Link>

            <SearchBar/>

            <Box sx={{ml: 'auto', mr: 5}}>
              {(isAuthenticated && dueCount > 0) && (
                <DueBadge count={dueCount}/>
              )}
            </Box>

            <ColorModeToggle sx={{ mr: 1 }} />

            {isAuthenticated ? (
              <Box sx={{flexGrow: 0}}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                    <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg"/>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{mt: '45px'}}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Link to="/account" style={{textDecoration: 'none', color: 'inherit'}}>
                      <Typography sx={{textAlign: 'center'}}>Account</Typography>
                    </Link>
                  </MenuItem>

                  <MenuItem onClick={handleClickLogout}>
                    <Typography sx={{textAlign: 'center'}}>Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{flexGrow: 0, ml: 'auto', display: 'flex', alignItems: 'center'}}>
                <Link to="/login" style={{textDecoration: 'none', color: 'inherit'}}>
                  <Tooltip title="Login">
                    <AccountCircleIcon sx={{fontSize: 35}}/>
                  </Tooltip>
                </Link>
              </Box>
            )}

          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar/>
    </>
  );
}
