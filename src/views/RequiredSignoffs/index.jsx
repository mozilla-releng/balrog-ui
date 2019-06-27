import React, { Fragment } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import RouteWithProps from '../../components/RouteWithProps';
import routes from './routes';
import { withUser } from '../../utils/AuthContext';

function RequiredSignoffs(props) {
  const {
    user,
    match: { path },
  } = props;

  return (
    <Fragment>
      {user ? (
        <Switch>
          {routes(path).map(({ routes, ...routeProps }) => (
            <RouteWithProps
              key={routeProps.path || 'not-found'}
              {...routeProps}
            />
          ))}
        </Switch>
      ) : (
        <Redirect to="/" />
      )}
    </Fragment>
  );
}

export default withUser(RequiredSignoffs);
