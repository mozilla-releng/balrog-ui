import lazy from '../../utils/lazy';

const ListSettings = lazy(() =>
  import(/* webpackChunkName: 'Settings.ListSettings' */ './ListSettings')
);

export default path => [
  {
    component: ListSettings,
    path,
  },
];
