import { hot } from 'react-hot-loader';
import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import Main from './Main';

const App = () => (
  <div>
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
  </div>
);

export default hot(module)(App);
