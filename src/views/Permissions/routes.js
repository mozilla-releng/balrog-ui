import lazy from '../../utils/lazy';

const ListPermissions = lazy(() =>
  import(/* webpackChunkName: 'Permissions.ListPermissions' */ './ListPermissions')
);

export default path => [
  {
    component: ListPermissions,
    path,
  },
];
