import lazy from '../../../utils/lazy';

const ListUsers = lazy(() =>
  import(/* webpackChunkName: 'Users.ListUsers' */ './ListUsers')
);
const User = lazy(() => import(/* webpackChunkName: 'Users.User' */ './User'));

export default path => [
  {
    component: User,
    path: '/settings/users/:username',
  },
  {
    component: ListUsers,
    path,
  },
];
