import React from 'react';
import { bool } from 'prop-types';
import Dashboard from '../../../components/Dashboard';

function ViewUser({ isNewUser, ...props }) {
  console.log(props);

  return <Dashboard title="Users"> i am a user </Dashboard>;
}

ViewUser.propTypes = {
  isNewUser: bool,
};

ViewUser.defaultProps = {
  isNewUser: false,
};

export default ViewUser;
