import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Settings from '@material-ui/icons/Settings';

const useStyles = makeStyles(theme => ({
  settings: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    padding: 0,
  },
}));
const navItems = [
  {
    value: 'Users',
    path: '/users',
  },
  {
    value: 'Roles',
    path: '/roles',
  },
  {
    value: 'Required Signoffs',
    path: '/required_signoffs',
  },
];

export default function SettingsMenu() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = e => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Fragment>
      <IconButton
        className={classes.avatar}
        aria-haspopup="true"
        aria-controls="user-menu"
        aria-label="user menu"
        onClick={handleMenuOpen}>
        <Settings />
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={handleMenuClose}>
        {navItems.map(navItem => (
          <MenuItem
            title={navItem.value}
            key={navItem.value}
            component="a"
            href={navItem.path}>
            {navItem.value}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
}
