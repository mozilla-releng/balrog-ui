import lazy from './utils/lazy';
import releaseRoutes from './views/Releases/routes';
import ruleRoutes from './views/Rules/routes';
import settingsRoutes from './views/Settings/routes';

const History = lazy(() =>
  import(/* webpackChunkName: 'History' */ './views/History')
);
const Home = lazy(() => import(/* webpackChunkName: 'Home' */ './views/Home'));
const Releases = lazy(() =>
  import(/* webpackChunkName: 'Releases' */ './views/Releases')
);
const Rules = lazy(() =>
  import(/* webpackChunkName: 'Rules' */ './views/Rules')
);
const Settings = lazy(() =>
  import(/* webpackChunkName: 'Settings' */ './views/Settings')
);
const Login = lazy(() =>
  import(/* webpackChunkName: 'Login' */ './views/Login')
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
    component: History,
    path: '/history',
  },
  {
    component: Settings,
    path: '/settings',
    routes: settingsRoutes('/settings'),
  },
  {
    component: Login,
    path: '/login',
  },
  {
    component: Home,
    path: '/',
    exact: true,
  },
];
