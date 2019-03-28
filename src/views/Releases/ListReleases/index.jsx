import React from 'react';
import PlusIcon from 'mdi-react/PlusIcon';
import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
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
      <IconButton
        className={classes.fab}
        classes={{ root: classes.fab }}
        onClick={handleReleaseAdd}>
        <PlusIcon />
      </IconButton>
    </Dashboard>
  );
}

export default ListPermissions;
