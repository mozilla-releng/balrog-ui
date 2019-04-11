module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    '@mozilla-frontend-infra/react-lint',
    [
      '@neutrinojs/react',
      {
        devServer: {
          host: process.env.HOST,
          port: process.env.PORT
        },
        html: {
          title: 'Balrog Admin',
          favicon: `${__dirname}/src/images/favicon.png`
        },
        env: {
          BALROG_ROOT_URL: 'https://localhost:8010',
        },
      }
    ],
    '@neutrinojs/jest'
  ]
};
