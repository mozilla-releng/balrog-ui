const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 9000;
const port = process.env.PORT || DEFAULT_PORT;

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
          port,
          historyApiFallback: {
            disableDotRule: true,
          },
          headers: {
            /*
              Whenever this changes we will also need to update the headers
              for our deployed environments in XXXXXXX.

              script-src: 
              img-src:
              style-src:
              font-src:
              connect-src:
            */
            'Content-Security-Policy': "default-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' https://*.gravatar.com https://*.githubusercontent.com https://i1.wp.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src https://localhost:8010"
          },
        },
        html: {
          favicon: `${__dirname}/src/images/favicon.png`,
          template: 'src/index.html',
        },
        env: {
          HOST: DEFAULT_HOST,
          PORT: DEFAULT_PORT,
          BALROG_ROOT_URL: 'https://localhost:8010',
          AUTH0_CLIENT_ID: 'GlZhJQfx52b7MLQ19AjuTJHieiB4oh1j',
          AUTH0_DOMAIN: 'balrog-localdev.auth0.com',
          AUTH0_AUDIENCE: 'balrog-localdev',
          AUTH0_RESPONSE_TYPE: 'token id_token',
          AUTH0_SCOPE: 'full-user-credentials openid profile email',
          AUTH0_REDIRECT_URI: `http://localhost:${port}/login`,
        },
      }
    ],
    (neutrino) => {
      neutrino.config.resolve.alias
        .set('react-dom', '@hot-loader/react-dom');
    },
    '@neutrinojs/jest'
  ]
};
