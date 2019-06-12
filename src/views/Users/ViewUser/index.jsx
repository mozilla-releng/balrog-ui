import React, { useEffect, useState, Fragment } from 'react';
import { bool } from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import Dashboard from '../../../components/Dashboard';
import useAction from '../../../hooks/useAction';
import { getUserInfo } from '../../../utils/Users';

function ViewUser({ isNewUser, ...props }) {
  const {
    match: {
      params: { username: existingUsername },
    },
  } = props;
  const [username, setUsername] = useState('');
  const [roles, setRoles] = useState({});
  const [permissions, setPermissions] = useState({});
  const [userAction, fetchUser] = useAction(getUserInfo);
  const isLoading = userAction.loading;
  const { error } = userAction;

  useEffect(() => {
    if (!isNewUser) {
      fetchUser(existingUsername).then(result => {
        setUsername(result.data.data.username);
        setRoles(result.data.data.roles);
        setPermissions(result.data.data.permissions);
      });
    }
  }, []);

  const handleUsernameChange = ({ target: { value } }) => setUsername(value);

  return (
    <Dashboard title="Users">
      {error && <ErrorPanel error={error} />}
      {isLoading && <Spinner loading />}
      {!isLoading && (
        <Fragment>
          <form autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs>
                <TextField
                  required
                  disabled={!isNewUser}
                  onChange={handleUsernameChange}
                  fullWidth
                  label="Username"
                  value={username}
                />
              </Grid>
            </Grid>
          </form>
        </Fragment>
      )}
    </Dashboard>
  );
}

ViewUser.propTypes = {
  isNewUser: bool,
};

ViewUser.defaultProps = {
  isNewUser: false,
};

export default ViewUser;
