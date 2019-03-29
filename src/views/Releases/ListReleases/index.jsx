import React from 'react';
import PlusIcon from 'mdi-react/PlusIcon';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Dashboard from '../../../components/Dashboard';

const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
  },
}));

function ListPermissions() {
  const classes = useStyles();

  function handleReleaseAdd() {}

  return (
    <Dashboard>
      Releases
      <Tooltip title="Add Release">
        <Fab
          color="primary"
          className={classes.fab}
          classes={{ root: classes.fab }}
          onClick={handleReleaseAdd}>
          <PlusIcon />
        </Fab>
      </Tooltip>
    </Dashboard>
  );
}

export default ListPermissions;
