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
import zip from '../../../utils/zip';

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
            {Object.keys(permissions).map(permission =>
              zip(
                [permission],
                (permissions[permission].options &&
                  permissions[permission].options.products) ||
                  [],
                (permissions[permission].options &&
                  permissions[permission].options.actions) ||
                  []
              ).map(row => (
                <Grid container spacing={2} key={`${row[0]}`}>
                  <Grid item xs>
                    {row[0] !== undefined && (
                      <TextField
                        value={row[0]}
                        disabled
                        label="Permission Name"
                      />
                    )}
                  </Grid>
                  <Grid item xs>
                    {row[1] !== undefined && (
                      <TextField value={row[1]} label="Product restriction" />
                    )}
                  </Grid>
                  <Grid item xs>
                    {row[2] !== undefined && (
                      <TextField value={row[2]} label="Action restriction" />
                    )}
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
