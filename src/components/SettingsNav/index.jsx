import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { SideNav, Nav, NavContext } from 'react-sidenav';
import Link from '../../utils/Link';

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
    <div
      className={classes.navItem}
      style={{ color: context.selected ? 'rgb(0, 166, 90)' : '' }}
      selected={context.selected}>
      {props.children}
    </div>
  );
};

export default withRouter(props => {
  const classes = useStyles();
  const currentSelection = props.location.pathname.split('/').slice(-1)[0];

  return (
    <SideNav defaultSelectedPath={currentSelection}>
      <Nav id="users">
        <Item>
          <Link className={classes.link} to="/settings/users">
            Users
          </Link>
        </Item>
      </Nav>
      <Nav id="roles">
        <Item>
          <Link className={classes.link} to="/settings/roles">
            Roles
          </Link>
        </Item>
      </Nav>
      <Nav id="required_signoffs">
        <Item>
          <Link className={classes.link} to="/settings/required_signoffs">
            Required Signoffs
          </Link>
        </Item>
      </Nav>
    </SideNav>
  );
});
