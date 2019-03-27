import lazy from '../../utils/lazy';

const ListRules = lazy(() =>
  import(/* webpackChunkName: 'Rules.ListRules' */ './ListRules')
);
const ScheduledRuleChanges = lazy(() =>
  import(/* webpackChunkName: 'Rules.ScheduledRuleChanges' */ './ScheduledRuleChanges')
);

export default path => [
  {
    component: ScheduledRuleChanges,
    path: `${path}/scheduled-changes`,
  },
  {
    component: ListRules,
    path,
  },
];
