import React, { useContext, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import LogoutVariantIcon from 'mdi-react/LogoutVariantIcon';
import AuthContext from '../../utils/AuthContext';

const useStyles = makeStyles(theme => ({
  avatar: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    padding: 0,
  },
}));

export default function UserMenu() {
  const classes = useStyles();
  const { authorize, unauthorize, user } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = e => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogoutClick = () => {
    handleMenuClose();
    unauthorize();
  };

  return (
    <Fragment>
      {user ? (
        <IconButton
          className={classes.avatar}
          aria-haspopup="true"
          aria-controls="user-menu"
          aria-label="user menu"
          onClick={handleMenuOpen}>
          {user.userInfo.picture ? (
            <Avatar alt={user.userInfo.nickname} src={user.userInfo.picture} />
          ) : (
            <Avatar alt={user.userInfo.name}>{user.userInfo.name[0]}</Avatar>
          )}
        </IconButton>
      ) : (
        <Button
          onClick={authorize}
          size="small"
          variant="contained"
          color="secondary">
          Login
        </Button>
      )}
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}>
        <MenuItem title="Logout" onClick={handleLogoutClick}>
          <LogoutVariantIcon />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
