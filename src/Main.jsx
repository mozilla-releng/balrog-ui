import React from 'react';
import { BrowserRouter, Switch, Link } from 'react-router-dom';
import RouteWithProps from './components/RouteWithProps';
import routes from './routes';

function Main() {
  return (
    <BrowserRouter>
      <Link to="/">Home</Link> <Link to="/history">Link 1</Link>{' '}
      <Link to="/signoffs">Link 2</Link>{' '}
      <Switch>
        {routes.map(({ path, ...rest }) => (
          <RouteWithProps key={path || 'not-found'} path={path} {...rest} />
        ))}
      </Switch>
    </BrowserRouter>
  );
}

export default Main;
