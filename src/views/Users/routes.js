import lazy from '../../utils/lazy';

const ListUsers = lazy(() =>
  import(/* webpackChunkName: 'Users.ListUsers' */ './ListUsers')
);
const User = lazy(() => import(/* webpackChunkName: 'Users.User' */ './User'));

export default path => [
  // TODO: This page doesn't work as a deep link
  {
    component: User,
    path: '/users/:username',
  },
  {
    component: ListUsers,
    path,
  },
];
