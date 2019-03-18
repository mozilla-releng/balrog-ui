module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    '@mozilla-frontend-infra/react-lint',
    [
      '@neutrinojs/react',
      {
        html: {
          title: 'balrog-ui'
        }
      }
    ],
    '@neutrinojs/jest'
  ]
};
