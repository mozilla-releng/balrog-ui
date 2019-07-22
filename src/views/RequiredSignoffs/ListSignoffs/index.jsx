import React, { Fragment, useEffect, useState } from 'react';
import { titleCase } from 'change-case';
import classNames from 'classnames';
import { view, lensPath } from 'ramda';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import PlusIcon from 'mdi-react/PlusIcon';
import Dashboard from '../../../components/Dashboard';
import DialogAction from '../../../components/DialogAction';
import SignoffCard from '../../../components/SignoffCard';
import ErrorPanel from '../../../components/ErrorPanel';
import SignoffCardEntry from '../../../components/SignoffCardEntry';
import { signoffRequiredSignoff, revokeRequiredSignoff } from '../../../services/requiredSignoffs';
import Link from '../../../utils/Link';
import getRequiredSignoffs from '../utils/getRequiredSignoffs';
import useAction from '../../../hooks/useAction';
import { DIALOG_ACTION_INITIAL_STATE } from '../../../utils/constants';

const getPermissionChangesLens = product => lensPath([product, 'permissions']);
const getRulesOrReleasesChangesLens = product =>
  lensPath([product, 'channels']);
const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdown: {
    minWidth: 200,
  },
  dropdownDiv: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
  },
  card: {
    marginBottom: theme.spacing(2),
  },
  lastDivider: {
    display: 'none',
  },
}));

function ListSignoffs() {
  const classes = useStyles();
  const [requiredSignoffs, setRequiredSignoffs] = useState(null);
  const [product, setProduct] = useState('Firefox');
  const [dialogState, setDialogState] = useState(DIALOG_ACTION_INITIAL_STATE);
  const [getRSAction, getRS] = useAction(getRequiredSignoffs);
  const [signoffAction, signoff] = useAction(signoffRequiredSignoff);
  const [revokeAction, revoke] = useAction(revokeRequiredSignoff);
  const loading = getRSAction.loading;
  const error = getRSAction.error || signoffAction.error || revokeAction.error;
  const handleFilterChange = ({ target: { value } }) => setProduct(value);
  const permissionChanges = view(
    getPermissionChangesLens(product),
    requiredSignoffs
  );
  const rulesOrReleasesChanges = view(
    getRulesOrReleasesChangesLens(product),
    requiredSignoffs
  );

  // Fetch view data
  useEffect(() => {
    getRS().then(({ data }) => setRequiredSignoffs(data));
  }, []);

  const handleDialogError = error => {
    setDialogState({ ...dialogState, error });
  };

  const handleDialogClose = () => {
    setDialogState(DIALOG_ACTION_INITIAL_STATE);
  };

  const handleDialogSubmit = async () => {
    // make signoff or revocation
  };

  const handleDialogActionComplete = result => {
    // update state
    handleDialogClose();
  };

  const handleSignoff = () => {
    // if user has more than one role, open dialog
    // else, signoff directly and update UI
  };
  const handleRevoke = () => {
    // if user has more than one role, open dialog
    // else, signoff directly and update UI
  };

  return (
    <Dashboard title="Required Signoffs">
      {error && <ErrorPanel fixed error={error} />}
      {loading && <Spinner loading />}
      {requiredSignoffs && (
        <Fragment>
          <div className={classes.toolbar}>
            {permissionChanges && (
              <Typography gutterBottom variant="h5">
                Changes to Permissions
              </Typography>
            )}
            {!permissionChanges && rulesOrReleasesChanges && (
              <Typography gutterBottom variant="h5">
                Changes to Rules / Releases
              </Typography>
            )}
            <div className={classes.dropdownDiv}>
              <TextField
                className={classes.dropdown}
                select
                label="Product"
                value={product}
                onChange={handleFilterChange}>
                {Object.keys(requiredSignoffs).map(product => (
                  <MenuItem key={product} value={product}>
                    {product}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          {permissionChanges && (
            <SignoffCard
              className={classes.card}
              title={titleCase(product)}
              to={`/required-signoffs/${product}`}>
              {Object.entries(permissionChanges).map(
                ([name, role], index, arr) => {
                  const key = `${name}-${index}`;

                  return (
                    <Fragment key={key}>
                      <SignoffCardEntry
                        key={name}
                        name={name}
                        entry={role}
                        onSignoff={handleSignoff}
                        onRevoke={handleRevoke}
                      />
                      <Divider
                        className={classNames({
                          [classes.lastDivider]: arr.length - 1 === index,
                        })}
                      />
                    </Fragment>
                  );
                }
              )}
            </SignoffCard>
          )}
          <div>
            {rulesOrReleasesChanges && (
              <Fragment>
                {permissionChanges && (
                  <Fragment>
                    <br />
                    <Typography gutterBottom variant="h5">
                      Changes to Rules / Releases
                    </Typography>
                    <br />
                  </Fragment>
                )}
                {Object.entries(rulesOrReleasesChanges).map(
                  ([channelName, roles]) => (
                    <SignoffCard
                      key={`${product}-${channelName}`}
                      className={classes.card}
                      title={titleCase(`${product} ${channelName} Channel`)}
                      to={`/required-signoffs/${product}/${channelName}`}>
                      {Object.entries(roles).map(
                        ([roleName, role], index, arr) => {
                          const key = `${roleName}-${index}`;

                          return (
                            <Fragment key={key}>
                              <SignoffCardEntry
                                key={roleName}
                                name={roleName}
                                entry={role}
                                onSignoff={handleSignoff}
                                onRevoke={handleRevoke}
                              />
                              <Divider
                                className={classNames({
                                  [classes.lastDivider]:
                                    arr.length - 1 === index,
                                })}
                              />
                            </Fragment>
                          );
                        }
                      )}
                    </SignoffCard>
                  )
                )}
              </Fragment>
            )}
            {!permissionChanges && !rulesOrReleasesChanges && (
              <Typography>No required signoffs for {product}</Typography>
            )}
          </div>
          <Link to="/required-signoffs/create">
            <Tooltip title="Enable Signoff for a New Product">
              <Fab
                color="primary"
                className={classes.fab}
                classes={{ root: classes.fab }}>
                <PlusIcon />
              </Fab>
            </Tooltip>
          </Link>
        </Fragment>
      )}
      <DialogAction
        open={dialogState.open}
        title={dialogState.title}
        body={dialogState.body}
        confirmText={dialogState.confirmText}
        onSubmit={handleDialogSubmit}
        onError={handleDialogError}
        error={dialogState.error}
        onComplete={handleDialogActionComplete}
        onClose={handleDialogClose}
      />
    </Dashboard>
  );
}

export default ListSignoffs;
