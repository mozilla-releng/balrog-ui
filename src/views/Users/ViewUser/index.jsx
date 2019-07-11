import React, { useEffect, useState, Fragment } from 'react';
import { bool } from 'prop-types';
import { defaultTo } from 'ramda';
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
import Downshift from 'downshift';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import AutoCompleteText from '../../../components/AutoCompleteText';
import getSuggestions from '../../../components/AutoCompleteText/getSuggestions';
import Dashboard from '../../../components/Dashboard';
import SpeedDial from '../../../components/SpeedDial';
import useAction from '../../../hooks/useAction';
import { getProducts } from '../../../services/rules';
import { getUserInfo } from '../../../services/users';
import {
  allPermissions,
  permissionRestrictionMappings,
} from '../../../utils/Users';

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
  gridWithIcon: {
    marginTop: theme.spacing(3),
  },
  gridRoleDelete: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

function ViewUser({ isNewUser, ...props }) {
  const getEmptyPermission = () => ({
    name: '',
    options: {
      products: [],
      actions: [],
    },
    metadata: {
      isAdditional: true,
    },
  });
  const getEmptyRole = () => ({
    name: '',
    data_version: null,
    metadata: {
      isAdditional: true,
    },
  });
  const {
    match: {
      params: { username: existingUsername },
    },
  } = props;
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [roles, setRoles] = useState([]);
  const [originalRoles, setOriginalRoles] = useState([]);
  const [additionalRoles, setAdditionalRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [originalPermissions, setOriginalPermissions] = useState([]);
  const [additionalPermissions, setAdditionalPermissions] = useState(
    isNewUser ? [getEmptyPermission()] : []
  );
  const [products, setProducts] = useState([]);
  const [productsAction, fetchProducts] = useAction(getProducts);
  const [userAction, fetchUser] = useAction(getUserInfo);
  const [saveAction, saveUser] = useAction(() => {});
  const isLoading = userAction.loading || productsAction.loading;
  const error = userAction.error || productsAction.error || saveAction.error;
  const defaultToEmptyString = defaultTo('');

  useEffect(() => {
    if (!isNewUser) {
      Promise.all([fetchUser(existingUsername), fetchProducts()]).then(
        ([userdata, productdata]) => {
          const roles = Object.keys(userdata.data.data.roles).map(name => ({
            name,
            data_version: userdata.data.data.roles[name].data_version,
            metadata: {
              isAdditional: false,
            },
          }));
          const permissions = Object.keys(userdata.data.data.permissions).map(
            name => {
              const details = userdata.data.data.permissions[name];

              return {
                name,
                options: details.options,
                data_version: details.data_version,
                metadata: {
                  isAdditional: false,
                },
              };
            }
          );

          setUsername(userdata.data.data.username);
          setRoles(roles);
          setOriginalRoles(JSON.parse(JSON.stringify(roles)));
          setPermissions(permissions);
          setOriginalPermissions(JSON.parse(JSON.stringify(permissions)));
          setProducts(productdata.data.data.product);
        }
      );
    }
  }, []);

  const handleUsernameChange = ({ target: { value } }) => setUsername(value);
  // this currently throws an error about controlled components
  // (https://reactjs.org/docs/forms.html#controlled-components)
  // not sure how to fix it yet
  const handleRoleNameChange = (role, index, value) => {
    setAdditionalRoles(
      additionalRoles.map((entry, i) => {
        if (i !== index) {
          return entry;
        }

        const result = entry;

        result.name = value;

        return result;
      })
    );
  };

  const handleRoleAdd = () => {
    setAdditionalRoles(additionalRoles.concat([getEmptyRole()]));
  };

  const handleRoleDelete = (role, index) => {
    const excludeRole = (entry, i) => !(i === index);

    if (roles.filter(entry => entry.name === role.name).length > 0) {
      setRoles(roles.filter(excludeRole));
    } else {
      setAdditionalRoles(additionalRoles.filter(excludeRole));
    }
  };

  const handlePermissionAdd = () => {
    setAdditionalPermissions(
      additionalPermissions.concat([getEmptyPermission()])
    );
  };

  const handlePermissionNameChange = permission => value => {
    const setName = entry => {
      if (entry.name !== permission.name) {
        return entry;
      }

      const result = entry;

      result.name = value;

      return result;
    };

    // Only additional permissions can have their names changed
    // so there's no need to check if the modified permission is
    // additional or not.
    setAdditionalPermissions(additionalPermissions.map(setName));
  };

  const handleUserSave = () => {};
  const handleUserDelete = () => {};
  const renderRole = (role, index) => (
    <Grid container spacing={2} key={index}>
      <Grid item xs={11}>
        <TextField
          disabled={role.metadata.isAdditional ? false : !isNewUser}
          onChange={e => handleRoleNameChange(role, index, e.target.value)}
          value={role.name}
          fullWidth
        />
      </Grid>
      <Grid item xs={1} className={classes.gridRoleDelete}>
        <IconButton onClick={() => handleRoleDelete(role, index)}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
  const renderPermission = permission => (
    <Grid container spacing={2} key={permission}>
      <Grid item xs>
        <AutoCompleteText
          value={defaultToEmptyString(permission.name)}
          onValueChange={handlePermissionNameChange}
          getSuggestions={getSuggestions(allPermissions)}
          label="Name"
          required
          disabled={!permission.metadata.isAdditional}
          inputProps={{
            autoFocus: true,
          }}
        />
      </Grid>
      <Grid item xs>
        product
      </Grid>
      <Grid item xs>
        action
      </Grid>
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
            {roles.map(renderRole)}
            {additionalRoles.map(renderRole)}
            <Grid item xs className={classes.addGrid}>
              <Button
                onClick={handleRoleAdd}
                className={classes.fullWidth}
                variant="outlined">
                <PlusIcon />
              </Button>
            </Grid>
            <br />
            <br />
            <br />
            <Typography variant="h5">Permissions</Typography>
            {permissions.map(renderPermission)}
            {additionalPermissions.map(renderPermission)}
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
