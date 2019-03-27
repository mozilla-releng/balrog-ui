export default [
  {
    children: [
      {
        value: 'All Rules',
        path: '/rules',
      },
      {
        value: 'Scheduled Rule Changes',
        path: '/rules/scheduled-changes',
      },
    ],
    value: 'Rules',
    id: 'rules',
  },
  {
    children: [
      {
        value: 'All Releases',
        path: '/releases',
      },
      {
        value: 'Scheduled Release Changes',
        path: '/releases/scheduled-changes',
      },
    ],
    value: 'Releases',
    id: 'releases',
  },
  {
    children: [
      {
        value: 'All Permissions',
        path: '/permissions',
      },
      {
        value: 'Scheduled Permission Changes',
        path: '/permissions/scheduled-changes',
      },
    ],
    value: 'Permissions',
    id: 'permissions',
  },
  {
    value: 'Sign Offs',
    path: '/signoffs',
  },
  {
    value: 'History',
    path: '/history',
  },
];
