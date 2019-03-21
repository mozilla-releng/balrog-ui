import { hot } from 'react-hot-loader';
import React from 'react';
import Main from './Main';
import './App.css';

const App = () => (
  <div className="App">
    <h1>Welcome to Balrog Admin</h1>
    <Main />
  </div>
);

export default hot(module)(App);
