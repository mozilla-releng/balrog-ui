import React from 'react';
import PlusIcon from 'mdi-react/PlusIcon';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Dashboard from '../../../components/Dashboard';
import Link from '../../../utils/Link';

const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
  },
}));

function ListPermissions() {
  const classes = useStyles();

  return (
    <Dashboard>
      <Typography variant="subtitle1">Releases</Typography>
      <Tooltip title="Add Release">
        <Link to="/releases/create">
          <Fab color="primary" className={classes.fab}>
            <PlusIcon />
          </Fab>
        </Link>
      </Tooltip>
    </Dashboard>
  );
}

export default ListPermissions;
