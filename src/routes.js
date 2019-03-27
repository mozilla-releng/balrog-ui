import lazy from './utils/lazy';

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
  },
  {
    component: Rules,
    path: '/rules',
  },
  {
    component: Permissions,
    path: '/permissions',
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
