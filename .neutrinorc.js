const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 9000;

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
          host: process.env.HOST || DEFAULT_HOST,
          port: process.env.PORT || DEFAULT_PORT
        },
        html: {
          title: 'Balrog Admin',
          favicon: `${__dirname}/src/images/favicon.png`
        },
        env: {
          BALROG_ROOT_URL: 'https://localhost:8010',
          HOST: DEFAULT_HOST,
          PORT: DEFAULT_PORT
        },
      }
    ],
    '@neutrinojs/jest'
  ]
};
