import lazy from '../../utils/lazy';

const Users = lazy(() =>
  import(/* webpackChunkName: 'Settings.Users' */ './Users')
);
const Roles = lazy(() =>
  import(/* webpackChunkName: 'Settings.Roles' */ './Roles')
);
const RequiredSignoffs = lazy(() =>
  import(/* webpackChunkName: 'Settings.RequiredSignoffs' */ './RequiredSignoffs')
);

export default path => [
  {
    component: Users,
    path: `${path}/users`,
  },
  {
    component: Roles,
    path: `${path}/roles`,
  },
  {
    component: RequiredSignoffs,
    path: `${path}/required_signoffs`,
  },
];
