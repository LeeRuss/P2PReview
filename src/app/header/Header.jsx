import { useState, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default function Header() {
  const { user, signOut } = useContext(UserContext);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed" sx={{ width: '100vw' }}>
      <Container maxWidth="100%">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Button
            component={RouterLink}
            to="/"
            sx={{
              my: 2,
              color: 'white',
              display: { xs: 'none', md: 'flex' },
            }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              P2PReview
            </Typography>
          </Button>
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              width: 'auto',
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem
                component={RouterLink}
                to="/yourWork"
                onClick={handleCloseNavMenu}
              >
                <Typography textAlign="center">Your work</Typography>
              </MenuItem>
              <MenuItem
                component={RouterLink}
                to="/yourReviews"
                onClick={handleCloseNavMenu}
              >
                <Typography textAlign="center">Your reviews</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Button
            component={RouterLink}
            to="/"
            sx={{ my: 2, color: 'white', display: { xs: 'flex', md: 'none' } }}
          >
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              P2PReview
            </Typography>
          </Button>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/yourWork"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Your work
            </Button>
            <Button
              component={RouterLink}
              to="/yourReviews"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Your reviews
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Show options">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Profile picture" src={user.avatar_url} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
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
              <MenuItem key={'settings'} component={RouterLink} to="/settings">
                <Typography textAlign="center">Settings</Typography>
              </MenuItem>
              <MenuItem key={'signout'} onClick={signOut}>
                <Typography textAlign="center">Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
