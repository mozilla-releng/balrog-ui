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
  const getEmptyPermission = () => ({
    options: {
      products: [],
      actions: [],
    },
  });
  const {
    match: {
      params: { username: existingUsername },
    },
  } = props;
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [roles, setRoles] = useState({});
  const [permissions, setPermissions] = useState({});
  const [originalPermissions, setOriginalPermissions] = useState({});
  const [additionalPermissions, setAdditionalPermissions] = useState({});
  const [userAction, fetchUser] = useAction(getUserInfo);
  const [saveAction, saveUser] = useAction(() => {});
  const isLoading = userAction.loading;
  const error = userAction.error || saveAction.error;

  useEffect(() => {
    if (!isNewUser) {
      fetchUser(existingUsername).then(result => {
        const { permissions } = result.data.data;

        setUsername(result.data.data.username);
        setRoles(result.data.data.roles);
        setPermissions(permissions);
        setOriginalPermissions(JSON.parse(JSON.stringify(permissions)));
      });
    }
  }, []);

  const addNewProduct = (permissions, permission) => {
    const toModify = permissions;

    if (toModify[permission].options.products === undefined) {
      toModify[permission].options.products = ['[product name]'];
    } else {
      toModify[permission].options.products.push('[product name]');
    }

    return toModify;
  };

  const addNewAction = (permissions, permission) => {
    const toModify = permissions;

    if (toModify[permission].options.actions === undefined) {
      toModify[permission].options.actions = ['[action]'];
    } else {
      toModify[permission].options.actions.push('[action]');
    }

    return toModify;
  };

  const handleUsernameChange = ({ target: { value } }) => setUsername(value);
  const handleRoleNameChange = () => {};
  const handleProductAdd = permission => () => {
    for (const [key, value] of Object.entries(permissions)) {
      if (key === permission) {
        setPermissions(addNewProduct(permissions, permission));
      }
    }
  };

  const handleActionAdd = permission => () => {
    for (const [key, value] of Object.entries(permissions)) {
      if (key === permission) {
        setPermissions(addNewAction(permissions, permission));
      }
    }
  };

  const handlePermissionAdd = () => {
    additionalPermissions[''] = getEmptyPermission();
    setAdditionalPermissions(Object.assign({}, additionalPermissions));
  };

  const handleUserSave = () => {};
  const handleUserDelete = () => {};
  const renderPermissionRow = (permission, product, action, isNew) => (
    <Grid
      container
      spacing={2}
      key={`${permission}-${product}-${action}`}
      className={classes.permission}>
      <Grid item xs>
        {permission !== undefined && (
          <TextField
            value={permission}
            className={classes.fullWidth}
            disabled={!isNew}
          />
        )}
      </Grid>
      {product === undefined && <Grid item xs />}
      {product !== undefined && product !== 'add' && (
        <Grid item xs>
          <TextField value={product} className={classes.fullWidth} />
        </Grid>
      )}
      {product === 'add' && (
        <Grid item xs className={classes.addGrid}>
          <Button
            onClick={handleProductAdd(permission)}
            className={classes.fullWidth}
            variant="outlined">
            <PlusIcon />
          </Button>
        </Grid>
      )}
      {action === undefined && <Grid item xs />}
      {action !== undefined && action !== 'add' && (
        <Grid item xs>
          <TextField value={action} className={classes.fullWidth} />
        </Grid>
      )}
      {action === 'add' && (
        <Grid item xs className={classes.addGrid}>
          <Button
            onClick={handleActionAdd(permission)}
            className={classes.fullWidth}
            variant="outlined">
            <PlusIcon />
          </Button>
        </Grid>
      )}
    </Grid>
  );

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
              ).map(row => renderPermissionRow(row[0], row[1], row[2]))
            )}
            {Object.keys(additionalPermissions).map(permission =>
              zip(
                [permission],
                (
                  (additionalPermissions[permission].options &&
                    additionalPermissions[permission].options.products) ||
                  []
                ).concat(['add']),
                (
                  (additionalPermissions[permission].options &&
                    additionalPermissions[permission].options.actions) ||
                  []
                ).concat(['add'])
              ).map(row => renderPermissionRow(row[0], row[1], row[2], true))
            )}
            <Grid item xs className={classes.addGrid}>
              <Grid item xs={11}>
                <Button
                  onClick={handlePermissionAdd}
                  className={classes.fullWidth}
                  variant="outlined">
                  <PlusIcon />
                </Button>
              </Grid>
            </Grid>
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
