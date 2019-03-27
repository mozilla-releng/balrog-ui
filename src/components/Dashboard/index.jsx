import React, { useState, Fragment } from 'react';
import { node } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';
import menuItems from './menuItems';

const useStyles = makeStyles(theme => ({
  title: {
    textDecoration: 'none',
  },
  main: {
    maxWidth: 1592,
    marginTop: theme.spacing.unit * 3,
  },
  nav: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    '& button, & a:not(:last-child)': {
      marginRight: theme.spacing.unit,
    },
  },
}));

export default function Dashboard(props) {
  const initialAnchor = { id: null, target: undefined };
  const [menuAnchorEl, setMenuAnchorEl] = useState(initialAnchor);
  const classes = useStyles();
  const { children } = props;

  function handleAnchorClick({ currentTarget }) {
    setMenuAnchorEl({
      id: currentTarget.id,
      target: currentTarget,
    });
  }

  function handleRulesAnchorClose() {
    setMenuAnchorEl(initialAnchor);
  }

  return (
    <Fragment>
      <AppBar>
        <Toolbar>
          <Typography
            className={classes.title}
            color="inherit"
            variant="h6"
            noWrap
            component={Link}
            to="/">
            Balrog Admin
          </Typography>
          <nav className={classes.nav}>
            {menuItems.map(menuItem =>
              menuItem.children ? (
                <Fragment key={menuItem.value}>
                  <Button
                    id={menuItem.id}
                    color="inherit"
                    aria-owns={menuAnchorEl ? menuItem.id : undefined}
                    aria-haspopup={menuItem.children ? 'true' : 'false'}
                    onClick={handleAnchorClick}>
                    {menuItem.value}
                    <ChevronDownIcon />
                  </Button>
                  <Menu
                    id={menuItem.id}
                    anchorEl={
                      menuAnchorEl.id === menuItem.id
                        ? menuAnchorEl.target
                        : undefined
                    }
                    open={Boolean(menuAnchorEl.id === menuItem.id)}
                    onClose={handleRulesAnchorClose}>
                    {menuItem.children.map(child => (
                      <MenuItem
                        key={child.value}
                        component={Link}
                        to={child.path}>
                        {child.value}
                      </MenuItem>
                    ))}
                  </Menu>
                </Fragment>
              ) : (
                <Button
                  key={menuItem.value}
                  color="inherit"
                  component={Link}
                  to={menuItem.path}>
                  {menuItem.value}
                </Button>
              )
            )}
          </nav>
        </Toolbar>
      </AppBar>
      <div>Dashboard</div>
      <main className={classes.main}>{children}</main>
    </Fragment>
  );
}

Dashboard.prototype = {
  children: node.isRequired,
};
