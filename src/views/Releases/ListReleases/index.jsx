import React, { useEffect } from 'react';
import PlusIcon from 'mdi-react/PlusIcon';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import Dashboard from '../../../components/Dashboard';
import ReleaseCard from '../../../components/ReleaseCard';
import useAction from '../../../hooks/useAction';
import Link from '../../../utils/Link';
import { getReleases } from '../../../services/releases';

const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
  },
}));

function ListPermissions() {
  const classes = useStyles();
  const [releases, fetchReleases] = useAction(getReleases);
  const isLoading = releases.loading;

  useEffect(() => {
    fetchReleases();
  }, []);

  return (
    <Dashboard title="Releases">
      {isLoading && <Spinner loading />}
      {!isLoading && releases.data && (
        <Grid container spacing={4}>
          {releases.data.data.releases.map(release => (
            <Grid key={release.name} item xs={12}>
              <ReleaseCard release={release} />
            </Grid>
          ))}
        </Grid>
      )}
      {!isLoading && (
        <Link to="/releases/create">
          <Tooltip title="Add Release">
            <Fab color="primary" className={classes.fab}>
              <PlusIcon />
            </Fab>
          </Tooltip>
        </Link>
      )}
    </Dashboard>
  );
}

export default ListPermissions;
