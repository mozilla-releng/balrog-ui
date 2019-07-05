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
import AutoCompleteText from '../../../components/AutoCompleteText';
import Dashboard from '../../../components/Dashboard';
import SpeedDial from '../../../components/SpeedDial';
import useAction from '../../../hooks/useAction';
import { getProducts } from '../../../services/rules';
import { getUserInfo } from '../../../services/users';
import {
  allPermissions,
  permissionRestrictionMappings,
} from '../../../utils/Users';
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
          setProducts(productdata.data.data.products);
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

  const handleProductAdd = permission => {
    const addProduct = entry => {
      if (entry.name !== permission.name) {
        return entry;
      }

      const result = entry;

      if (!result.options.products) {
        result.options.products = [];
      }

      result.options.products.push('');

      return result;
    };

    return permission.metadata.isAdditional
      ? setAdditionalPermissions(additionalPermissions.map(addProduct))
      : setPermissions(permissions.map(addProduct));
  };

  const handleProductNameChange = (permission, index, value) => {
    const setProduct = entry => {
      if (entry.name !== permission.name) {
        return entry;
      }

      const result = entry;

      result.options.products[index] = value;

      return result;
    };

    return permission.metadata.isAdditional
      ? setAdditionalPermissions(additionalPermissions.map(setProduct))
      : setPermissions(permissions.map(setProduct));
  };

  const handleProductDelete = (permission, index) => {
    const removeProduct = entry => {
      if (entry.name !== permission.name) {
        return entry;
      }

      const result = entry;

      result.options.products.splice(index, 1);

      return result;
    };

    return permission.metadata.isAdditional
      ? setAdditionalPermissions(additionalPermissions.map(removeProduct))
      : setPermissions(permissions.map(removeProduct));
  };

  const handleActionAdd = permission => {
    const addAction = entry => {
      if (entry.name !== permission.name) {
        return entry;
      }

      const result = entry;

      if (!result.options.actions) {
        result.options.actions = [];
      }

      result.options.actions.push('');

      return result;
    };

    return permission.metadata.isAdditional
      ? setAdditionalPermissions(additionalPermissions.map(addAction))
      : setPermissions(permissions.map(addAction));
  };

  const handleActionNameChange = (permission, index, value) => {
    const setAction = entry => {
      if (entry.name !== permission.name) {
        return entry;
      }

      const result = entry;

      result.options.actions[index] = value;

      return result;
    };

    return permission.metadata.isAdditional
      ? setAdditionalPermissions(additionalPermissions.map(setAction))
      : setPermissions(permissions.map(setAction));
  };

  const handleActionDelete = (permission, index) => {
    const removeAction = entry => {
      if (entry.name !== permission.name) {
        return entry;
      }

      const result = entry;

      result.options.actions.splice(index, 1);

      return result;
    };

    return permission.metadata.isAdditional
      ? setAdditionalPermissions(additionalPermissions.map(removeAction))
      : setPermissions(permissions.map(removeAction));
  };

  const handlePermissionAdd = () => {
    setAdditionalPermissions(
      additionalPermissions.concat([getEmptyPermission()])
    );
  };

  const handlePermissionNameChange = permission => value => {
    const setName = additionalPermissions.map(entry => {
      if (entry.name !== permission.name) {
        return entry;
      }

      const result = entry;

      result.name = value;

      return result;
    });

    setAdditionalPermissions(setName);
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
  const getSuggestions = suggestions => value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : suggestions.filter(suggestion => {
          const keep =
            count < 5 &&
            suggestion.slice(0, inputLength).toLowerCase() === inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
  };

  const handleProductRestrictionSelection = permission => selectedItem => {
    if (permission.metadata.isAdditional) {
    } else {
    }
  };

  const handleProductRestrictionChange = () => {};
  const renderPermission = permission => (
    <Grid container spacing={2} key={permission}>
      <Grid item xs>
        <AutoCompleteText
          value={permission.name}
          onValueChange={handlePermissionNameChange(permission)}
          getSuggestions={getSuggestions(allPermissions)}
          label="Permission"
          inputProps={{
            disabled: !permission.metadata.isAdditional,
          }}
        />
      </Grid>
      <Grid item xs>
        <AutoCompleteText
          value={permission.options.products}
          onValueChange={handleProductRestrictionChange}
          onChange={() => handleProductRestrictionSelection(permission)}
          selectedItem={null}
          getSuggestions={getSuggestions(
            (permissionRestrictionMappings[permission.name].restrict_products &&
              products) ||
              []
          )}
          label="Product Restrictions"
        />
      </Grid>
      <Grid item xs>
        <AutoCompleteText
          value={permission.options.products}
          onValueChange={handleProductRestrictionChange}
          onChange={() => handleProductRestrictionSelection(permission)}
          selectedItem={null}
          getSuggestions={getSuggestions(
            permissionRestrictionMappings[permission.name].restrict_actions &&
              permissionRestrictionMappings[permission.name].supported_actions
          )}
          label="Action Restrictions"
        />
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
