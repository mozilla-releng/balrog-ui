import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { SideNav, Nav, NavContext } from 'react-sidenav';
import Link from '../../utils/Link';

const useStyles = makeStyles(props => ({
  navItem: {
    // TODO: this isn't changing colour when selected
    color: props.selected ? 'rgb(0, 166, 90)' : '#555',
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
}));
const Item = props => {
  const classes = useStyles();
  const context = React.useContext(NavContext);

  return (
    <div className={classes.navItem} selected={context.selected}>
      {props.children}
    </div>
  );
};

export default function SettingsNav() {
  const classes = useStyles();

  return (
    <SideNav>
      <Nav id="users">
        <Item>
          <Link className={classes.link} to="/rules">
            Users
          </Link>
        </Item>
      </Nav>
      <Nav id="roles">
        <Item>Roles</Item>
      </Nav>
      <Nav id="required_signoffs">
        <Item>Required Signoffs</Item>
      </Nav>
    </SideNav>
  );
}
