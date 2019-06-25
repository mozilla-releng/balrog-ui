import React, { useEffect, useState, Fragment } from 'react';
import { bool } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Tooltip from '@material-ui/core/Tooltip';
import ContentSaveIcon from 'mdi-react/ContentSaveIcon';
import Button from '@material-ui/core/Button';
import DeleteIcon from 'mdi-react/DeleteIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import Dashboard from '../../../components/Dashboard';
import SpeedDial from '../../../components/SpeedDial';
import useAction from '../../../hooks/useAction';
import { getUserInfo } from '../../../utils/Users';
import zip from '../../../utils/zip';

const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
    right: theme.spacing(12),
  },
  fullWidth: {
    width: '100%',
  },
  addGrid: {
    marginTop: theme.spacing(0),
  },
}));

function ViewUser({ isNewUser, ...props }) {
  const {
    match: {
      params: { username: existingUsername },
    },
  } = props;
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [roles, setRoles] = useState({});
  const [permissions, setPermissions] = useState({});
  const [userAction, fetchUser] = useAction(getUserInfo);
  const [saveAction, saveUser] = useAction(() => {});
  const isLoading = userAction.loading;
  const error = userAction.error || saveAction.error;

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
  const handleProductAdd = () => {};
  const handleActionAdd = () => {};
  const handleUserSave = () => {};
  const handleUserDelete = () => {};

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
            <Grid container spacing={2}>
              <Grid item xs>
                Name
              </Grid>
              <Grid item xs>
                Product Restrictions
              </Grid>
              <Grid item xs>
                Action Restrictions
              </Grid>
            </Grid>
            {Object.keys(permissions).map(permission =>
              zip(
                [permission],
                (
                  (permissions[permission].options &&
                    permissions[permission].options.products) ||
                  []
                ).concat(['add']),
                (
                  (permissions[permission].options &&
                    permissions[permission].options.actions) ||
                  []
                ).concat(['add'])
              ).map(row => (
                <Grid
                  container
                  spacing={2}
                  key={`${row[0]}`}
                  className={classes.permission}>
                  <Grid item xs>
                    {row[0] !== undefined && (
                      <TextField
                        value={row[0]}
                        className={classes.fullWidth}
                        disabled
                      />
                    )}
                  </Grid>
                  {row[1] === 'add' && (
                    <Grid item xs className={classes.addGrid}>
                      <Button
                        onClick={handleProductAdd}
                        className={classes.fullWidth}
                        variant="outlined">
                        <PlusIcon />
                      </Button>
                    </Grid>
                  )}
                  {row[1] !== undefined && row[1] !== 'add' && (
                    <Grid item xs>
                      <TextField value={row[1]} className={classes.fullWidth} />
                    </Grid>
                  )}
                  {row[1] === undefined && <Grid item xs />}
                  {row[2] === 'add' && (
                    <Grid item xs className={classes.addGrid}>
                      <Button
                        onClick={handleActionAdd}
                        className={classes.fullWidth}
                        variant="outlined">
                        <PlusIcon />
                      </Button>
                    </Grid>
                  )}
                  {row[2] !== undefined && row[2] !== 'add' && (
                    <Grid item xs>
                      <TextField value={row[2]} className={classes.fullWidth} />
                    </Grid>
                  )}
                  {row[2] === undefined && <Grid item xs />}
                </Grid>
              ))
            )}
          </form>
          <Tooltip title="Save User">
            <Fab
              disabled={saveAction.loading}
              onClick={handleUserSave}
              color="primary"
              className={classes.fab}>
              <ContentSaveIcon />
            </Fab>
          </Tooltip>
          {!isNewUser && (
            <SpeedDial ariaLabel="Secondary Actions">
              <SpeedDialAction
                disabled={saveAction.loading}
                icon={<DeleteIcon />}
                tooltipOpen
                tooltipTitle="Delete Signoff"
                onClick={handleUserDelete}
              />
            </SpeedDial>
          )}
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
