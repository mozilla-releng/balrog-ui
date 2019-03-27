import lazy from '../../utils/lazy';

const ListPermissions = lazy(() =>
  import(/* webpackChunkName: 'Permissions.ListPermissions' */ './ListPermissions')
);
const ScheduledPermissionChanges = lazy(() =>
  import(/* webpackChunkName: 'Permissions.ScheduledPermissionChanges' */ './ScheduledPermissionChanges')
);

export default path => [
  {
    component: ScheduledPermissionChanges,
    path: `${path}/scheduled-changes`,
  },
  {
    component: ListPermissions,
    path,
  },
];
