import lazy from '../../utils/lazy';

const ListReleases = lazy(() =>
  import(/* webpackChunkName: 'Releases.ListReleases' */ './ListReleases')
);
const ScheduledPermissionChanges = lazy(() =>
  import(/* webpackChunkName: 'Releases.ScheduledPermissionChanges' */ './ScheduledPermissionChanges')
);

export default path => [
  {
    component: ScheduledPermissionChanges,
    path: `${path}/scheduled-changes`,
  },
  {
    component: ListReleases,
    path,
  },
];
