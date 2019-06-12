import lazy from '../../utils/lazy';

const ListUsers = lazy(() =>
  import(/* webpackChunkName: 'Users.ListUsers' */ './ListUsers')
);
const ViewUser = lazy(() =>
  import(/* webpackChunkName: 'Users.ViewUser' */ './ViewUser')
);

export default path => [
  // TODO: This page doesn't work as a deep link
  {
    component: ViewUser,
    path: `${path}/create`,
    isNewUser: true,
  },
  {
    component: ViewUser,
    path: `${path}/:username`,
  },
  {
    component: ListUsers,
    path,
  },
];
