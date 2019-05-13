import lazy from '../../utils/lazy';

const Users = lazy(() =>
  import(/* webpackChunkName: 'Settings.Users' */ './Users')
);

export default path => [
  {
    component: Users,
    path,
  },
];
