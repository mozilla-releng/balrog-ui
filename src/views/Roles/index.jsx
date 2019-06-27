import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';
import { withUser } from '../../utils/AuthContext';

function Roles({ user }) {
  return (
    <Fragment>
      {user ? (
        <Dashboard title="Roles">
          <div>ROLES!</div>
        </Dashboard>
      ) : (
        <Redirect to="/" />
      )}
    </Fragment>
  );
}

export default withUser(Roles);
