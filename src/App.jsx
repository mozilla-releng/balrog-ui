import { hot } from 'react-hot-loader';
import React, { useState } from 'react';
import { Authorize } from 'react-auth0-components';
import { ThemeProvider } from '@material-ui/styles';
import AuthContext from './utils/AuthContext';
import { USER_SESSION } from './utils/constants';
import theme from './theme';
import Main from './Main';

const App = () => {
  const [authorize, setAuthorize] = useState(false);
  const [authContext, setAuthContext] = useState({
    authorize: () => setAuthorize(true),
    unauthorize: () => {
      setAuthorize(false);
      setAuthContext({
        ...authContext,
        user: null,
      });
    },
    user: null,
  });

  return (
    <AuthContext.Provider value={authContext}>
      <ThemeProvider theme={theme}>
        <Authorize
          authorize={authorize}
          popup
          domain={process.env.AUTH0_DOMAIN}
          clientID={process.env.AUTH0_CLIENT_ID}
          audience={process.env.AUTH0_AUDIENCE}
          redirectUri={process.env.AUTH0_REDIRECT_URI}
          responseType={process.env.AUTH0_RESPONSE_TYPE}
          scope={process.env.AUTH0_SCOPE}
          render={() => {
            const session = localStorage.getItem(USER_SESSION);

            if (session) {
              const user = JSON.parse(session);
              const expires = new Date(user.expiration);
              const now = new Date();

              if (
                expires > now &&
                user.authResult.accessToken !==
                  (authContext.user && authContext.user.authResult.accessToken)
              ) {
                authContext.unauthorize();
                setAuthContext({ ...authContext, user });
              } else {
                setAuthContext({ ...authContext, user: null });
              }
            }

            return <Main />;
          }}
        />
      </ThemeProvider>
    </AuthContext.Provider>
  );
};

export default hot(module)(App);
