import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import RouteWithProps from './components/RouteWithProps';
import routes from './routes';

function Main() {
  return (
    <BrowserRouter>
      <Switch>
        {routes.map(({ path, ...rest }) => (
          <RouteWithProps key={path || 'not-found'} path={path} {...rest} />
        ))}
      </Switch>
    </BrowserRouter>
  );
}

export default Main;
