import React, { useEffect, useState, Fragment } from 'react';
import { bool } from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from 'mdi-react/DeleteIcon';
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
  const handleRoleNameChange = () => {};
  const handlePermissionNameChange = () => {};

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
            <br />
            <br />
            <br />
            <Typography variant="h5">Roles</Typography>
            {Object.keys(roles).map(role => (
              <Grid container spacing={2} key={role}>
                <Grid item xs>
                  <TextField
                    onChange={handleRoleNameChange}
                    fullWidth
                    value={role}
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <br />
            <br />
            <br />
            <Typography variant="h5">Permissions</Typography>
            <div>
              {/* This is super ugly, and duplicates the first column */}
            </div>
            {Object.keys(permissions).map(permission =>
              (
                (permissions[permission].options &&
                  permissions[permission].options.products) ||
                []
              ).map(product => (
                <Grid container spacing={2} key={`${permission}-${product}`}>
                  {permissions[permission].options.products.indexOf(product) ===
                  0 ? (
                    <Grid item xs>
                      <TextField
                        onChange={handlePermissionNameChange}
                        value={permission}
                        label="Object"
                      />
                    </Grid>
                  ) : (
                    <Grid item xs />
                  )}
                  <Grid item xs key={product}>
                    <TextField value={product} label="Product restrictions" />
                  </Grid>
                </Grid>
              ))
            )}
            {Object.keys(permissions).map(permission =>
              (
                (permissions[permission].options &&
                  permissions[permission].options.actions) ||
                []
              ).map(action => (
                <Grid container spacing={2} key={`${permission}-${action}`}>
                  {permissions[permission].options.actions.indexOf(action) ===
                  0 ? (
                    <Grid item xs>
                      <TextField
                        onChange={handlePermissionNameChange}
                        value={permission}
                        label="Object"
                      />
                    </Grid>
                  ) : (
                    <Grid item xs />
                  )}
                  <Grid item xs key={action}>
                    <TextField value={action} label="Action restrictions" />
                  </Grid>
                </Grid>
              ))
            )}
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
