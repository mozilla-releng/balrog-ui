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
          title: 'Balrog Admin',
          favicon: `${__dirname}/src/images/favicon.png`
        }
      }
    ],
    '@neutrinojs/jest'
  ]
};
