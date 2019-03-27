import lazy from './utils/lazy';
import releaseRoutes from './views/Releases/routes';
import ruleRoutes from './views/Rules/routes';
import permissionRoutes from './views/Permissions/routes';

const History = lazy(() =>
  import(/* webpackChunkName: 'History' */ './views/History')
);
const Home = lazy(() => import(/* webpackChunkName: 'Home' */ './views/Home'));
const Permissions = lazy(() =>
  import(/* webpackChunkName: 'Permissions' */ './views/Permissions')
);
const Releases = lazy(() =>
  import(/* webpackChunkName: 'Releases' */ './views/Releases')
);
const Rules = lazy(() =>
  import(/* webpackChunkName: 'Rules' */ './views/Rules')
);
const Signoffs = lazy(() =>
  import(/* webpackChunkName: 'Signoffs' */ './views/Signoffs')
);

export default [
  {
    component: Releases,
    path: '/releases',
    routes: releaseRoutes('/releases'),
  },
  {
    component: Rules,
    path: '/rules',
    routes: ruleRoutes('/rules'),
  },
  {
    component: Permissions,
    path: '/permissions',
    routes: permissionRoutes('/permissions'),
  },
  {
    component: History,
    path: '/history',
  },
  {
    component: Signoffs,
    path: '/signoffs',
  },
  {
    component: Home,
    path: '/',
    exact: true,
  },
];
