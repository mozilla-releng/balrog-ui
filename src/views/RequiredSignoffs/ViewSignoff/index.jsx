import React, { useState, useEffect, Fragment } from 'react';
import { bool } from 'prop-types';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import NumberFormat from 'react-number-format';
import ContentSaveIcon from 'mdi-react/ContentSaveIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import DeleteIcon from 'mdi-react/DeleteIcon';
import Dashboard from '../../../components/Dashboard';
import SpeedDial from '../../../components/SpeedDial';
import AutoCompleteText from '../../../components/AutoCompleteText';
import { getProducts } from '../../../utils/Rules';
import getRequiredSignoffs from '../utils/getRequiredSignoffs';
import getRolesFromRequiredSignoffs from '../utils/getRolesFromRequiredSignoffs';
import useAction from '../../../hooks/useAction';

const useStyles = makeStyles(theme => ({
  iconButtonGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
    marginTop: theme.spacing(1),
  },
  fab: {
    ...theme.mixins.fab,
    right: theme.spacing(12),
  },
  gridWithIcon: {
    marginTop: theme.spacing(3),
  },
  addRoleButton: {
    width: '100%',
  },
  addRoleGrid: {
    marginTop: theme.spacing(5),
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
}));

function ViewSignoff({ isNewSignoff, ...props }) {
  const emptyRole = ['', '', { isAdditionalRole: true, id: Math.random() }];
  const { product, channel } = props.match.params;
  const classes = useStyles();
  const [channelTextValue, setChannelTextValue] = useState(channel || '');
  const [productTextValue, setProductTextValue] = useState(product || '');
  const [type, setType] = useState(channel ? 'channel' : 'permission');
  const [roles, setRoles] = useState([]);
  const [additionalRoles, setAdditionalRoles] = useState(
    isNewSignoff ? [emptyRole] : []
  );
  const [requiredSignoffs, getRS] = useAction(getRequiredSignoffs);
  const [products, getProds] = useAction(getProducts);
  const isLoading = requiredSignoffs.loading || products.loading;
  const handleTypeChange = ({ target: { value } }) => setType(value);
  const handleChannelChange = ({ target: { value } }) =>
    setChannelTextValue(value);
  const handleProductChange = value => setProductTextValue(value);
  const handleRoleValueChange = (role, index) => ({ floatValue: value }) => {
    const setRole = (entry, i) =>
      i === index ? [entry[0], value, entry[2]] : entry;

    return role[2].isAdditionalRole
      ? setAdditionalRoles(additionalRoles.map(setRole))
      : setRoles(roles.map(setRole));
  };

  const handleRoleNameChange = (role, index) => ({ target: { value } }) => {
    const result = additionalRoles.map((entry, i) =>
      i === index ? [value, entry[1], entry[2]] : entry
    );

    setAdditionalRoles(result);
  };

  const handleRoleAdd = () => {
    setAdditionalRoles(additionalRoles.concat([emptyRole]));
  };

  const handleRoleDelete = (role, index) => () => {
    const excludeRole = (entry, i) => !(i === index);

    return role[2].isAdditionalRole
      ? setAdditionalRoles(additionalRoles.filter(excludeRole))
      : setRoles(roles.filter(excludeRole));
  };

  // TODO: Add save logic
  const handleSignoffSave = () => {};
  // TODO: Add delete logic
  const handleSignoffDelete = () => {};

  useEffect(() => {
    if (isNewSignoff) {
      getProds();
    } else {
      // eslint-disable-next-line no-unused-vars
      Promise.all([getProds(), getRS()]).then(([prods, rs]) => {
        const roles = getRolesFromRequiredSignoffs(rs.data);

        setRoles(roles);
      });
    }
  }, [product, channel]);

  const renderRole = (role, index) => (
    <Grid
      key={role[2].id}
      className={classes.gridWithIcon}
      container
      spacing={2}>
      <Grid item xs>
        <TextField
          required
          disabled={role[2].isAdditionalRole ? false : !isNewSignoff}
          onChange={handleRoleNameChange(role, index)}
          fullWidth
          label="Role"
          value={role[0]}
        />
      </Grid>
      <Grid item xs>
        <NumberFormat
          allowNegative={false}
          required
          label="Signoffs Required"
          fullWidth
          value={role[1]}
          customInput={TextField}
          onValueChange={handleRoleValueChange(role, index)}
          decimalScale={0}
        />
      </Grid>
      <Grid className={classes.iconButtonGrid} item xs={1}>
        <IconButton
          onClick={handleRoleDelete(role, index)}
          className={classes.iconButton}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
  const getSuggestions = value => {
    const suggestions = products.data.data.product;
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

  return (
    <Dashboard>
      {requiredSignoffs.error && <ErrorPanel error={requiredSignoffs.error} />}
      {products.error && <ErrorPanel error={products.error} />}
      {isLoading && <Spinner loading />}
      {!isLoading && (
        <Fragment>
          <form autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <AutoCompleteText
                  inputValue={productTextValue}
                  onInputValueChange={handleProductChange}
                  getSuggestions={getSuggestions}
                  textFieldProps={{
                    autoFocus: true,
                    fullWidth: true,
                    label: 'Product',
                    placeholder: 'Product',
                    required: true,
                    disabled: !isNewSignoff,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl margin="normal" component="fieldset">
                  <FormLabel component="legend">Type</FormLabel>
                  <RadioGroup
                    aria-label="Type"
                    name="type"
                    value={type}
                    onChange={handleTypeChange}>
                    <FormControlLabel
                      disabled={!isNewSignoff}
                      value="channel"
                      control={<Radio />}
                      label="Channel"
                    />
                    <FormControlLabel
                      disabled={!isNewSignoff}
                      value="permission"
                      control={<Radio />}
                      label="Permission"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {type === 'channel' && (
                <Grid item xs={12}>
                  <TextField
                    required
                    disabled={!isNewSignoff}
                    onChange={handleChannelChange}
                    fullWidth
                    label="Channel"
                    value={channelTextValue}
                  />
                </Grid>
              )}
            </Grid>
            <br />
            <br />
            <br />
            <Typography variant="h5">Roles</Typography>
            {roles.map(renderRole)}
            {additionalRoles.map(renderRole)}
            <Grid className={classes.addRoleGrid} container>
              <Grid item xs={11}>
                <Button
                  onClick={handleRoleAdd}
                  className={classes.addRoleButton}
                  variant="outlined">
                  <PlusIcon />
                </Button>
              </Grid>
            </Grid>
          </form>
          <Tooltip title="Save Signoff">
            <Fab
              onClick={handleSignoffSave}
              color="primary"
              className={classes.fab}>
              <ContentSaveIcon />
            </Fab>
          </Tooltip>
          <SpeedDial ariaLabel="Secondary Actions">
            <SpeedDialAction
              icon={<DeleteIcon />}
              tooltipOpen
              tooltipTitle="Delete Signoff"
              onClick={handleSignoffDelete}
            />
          </SpeedDial>
        </Fragment>
      )}
    </Dashboard>
  );
}

ViewSignoff.propTypes = {
  // Set to true if user is not updating an existing signoff.
  isNewSignoff: bool,
};

ViewSignoff.defaultProps = {
  isNewSignoff: false,
};

export default ViewSignoff;
