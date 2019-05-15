import lazy from '../../utils/lazy';

const ListSignoffs = lazy(() =>
  import(/* webpackChunkName: 'Signoffs.ListSignoffs' */ './ListSignoffs')
);
const ViewSignoff = lazy(() =>
  import(/* webpackChunkName: 'Signoffs.ViewSignoff' */ './ViewSignoff')
);

export default path => [
  {
    component: ViewSignoff,
    path: `${path}/create`,
  },
  {
    component: ListSignoffs,
    path,
  },
];
