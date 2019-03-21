import lazy from './utils/lazy';

const History = lazy(() =>
  import(/* webpackChunkName: 'History' */ './views/History')
);
const Signoffs = lazy(() =>
  import(/* webpackChunkName: 'Signoffs' */ './views/Signoffs')
);
const Home = lazy(() => import(/* webpackChunkName: 'Home' */ './views/Home'));

export default [
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
