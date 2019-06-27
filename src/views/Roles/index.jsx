import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';
import isLoggedIn from '../../utils/isLoggedIn';

export default function Roles() {
  return (
    <Fragment>
      {isLoggedIn() ? (
        <Dashboard title="Roles">
          <div>ROLES!</div>
        </Dashboard>
      ) : (
        <Redirect to="/" />
      )}
    </Fragment>
  );
}
