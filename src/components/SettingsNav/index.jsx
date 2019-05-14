import React from 'react';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { SideNav, Nav, NavContext } from 'react-sidenav';
import Link from '../../utils/Link';
import navItems from './navItems';

const useStyles = makeStyles({
  navItem: {
    color: '#555',
    padding: '8px 12px',
    cursor: 'pointer',
    '&:hover': {
      color: 'rgb(0, 166, 90)',
    },
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
});
const Item = props => {
  const classes = useStyles();
  const context = React.useContext(NavContext);

  return (
    <Button
      className={classes.navItem}
      style={{ color: context.selected ? 'rgb(0, 166, 90)' : '' }}
      selected={context.selected}>
      {props.children}
    </Button>
  );
};

export default withRouter(props => {
  const classes = useStyles();
  const currentSelection = props.location.pathname.split('/').slice(-1)[0];

  return (
    <SideNav defaultSelectedPath={currentSelection}>
      {navItems.map(navItem => (
        <Nav key={navItem.id} id={navItem.id}>
          <Item>
            <Link className={classes.link} to={navItem.path}>
              {navItem.value}
            </Link>
          </Item>
        </Nav>
      ))}
    </SideNav>
  );
});
