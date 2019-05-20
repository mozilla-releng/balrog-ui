import React, { Fragment, useEffect, useState } from 'react';
import { titleCase } from 'change-case';
import classNames from 'classnames';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
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
import SignoffCard from '../../../components/SignoffCard';
import SignoffCardEntry from '../../../components/SignoffCardEntry';
import Link from '../../../utils/Link';
import getRequiredSignoffs from '../utils/getRequiredSignoffs';
import useAction from '../../../hooks/useAction';

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
    marginBottom: theme.spacing(2),
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
  const [{ error, loading }, getRS] = useAction(getRequiredSignoffs);
  const handleFilterChange = ({ target: { value } }) => setProduct(value);

  // Fetch view data
  useEffect(() => {
    getRS().then(({ data }) => setRequiredSignoffs(data));
  }, []);

  return (
    <Dashboard>
      {error && <ErrorPanel error={error} />}
      {loading && <Spinner loading />}
      {requiredSignoffs && (
        <Fragment>
          <div className={classes.toolbar}>
            <Typography gutterBottom variant="h5">
              Changes to Permissions
            </Typography>
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
          <SignoffCard
            className={classes.card}
            title={titleCase(product)}
            to={`/required-signoffs/${product}`}>
            {'permissions' in requiredSignoffs[product] &&
              Object.entries(requiredSignoffs[product].permissions).map(
                ([name, role], index, arr) => {
                  const key = `${name}-${index}`;

                  return (
                    <Fragment key={key}>
                      <SignoffCardEntry key={name} name={name} entry={role} />
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
          <div>
            <br />
            <Typography gutterBottom variant="h5">
              Changes to Rules / Releases
            </Typography>
            <br />
            {'channels' in requiredSignoffs[product] &&
              Object.entries(requiredSignoffs[product].channels).map(
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
                )
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
    </Dashboard>
  );
}

export default ListSignoffs;
