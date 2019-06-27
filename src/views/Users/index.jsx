import React, { Fragment } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import RouteWithProps from '../../components/RouteWithProps';
import routes from './routes';
import isLoggedIn from '../../utils/isLoggedIn';

export default function Users(props) {
  const {
    match: { path },
  } = props;

  return (
    <Fragment>
      {isLoggedIn() ? (
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
