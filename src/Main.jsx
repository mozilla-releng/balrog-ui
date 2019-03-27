import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import RouteWithProps from './components/RouteWithProps';
import Link from './utils/Link';
import routes from './routes';

function Main() {
  return (
    <BrowserRouter>
      <Link to="/">Home</Link> <Link to="/history">History</Link>{' '}
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
