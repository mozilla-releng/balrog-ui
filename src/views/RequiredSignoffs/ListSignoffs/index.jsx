import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import PlusIcon from 'mdi-react/PlusIcon';
import Dashboard from '../../../components/Dashboard';
import Link from '../../../utils/Link';

const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
  },
}));

function ListSignoffs() {
  const classes = useStyles();

  return (
    <Dashboard>
      <Typography variant="subtitle1">List Signoffs</Typography>
      <Link to="/signoffs/create">
        <Tooltip title="Enable Signoff for a New Product">
          <Fab
            color="primary"
            className={classes.fab}
            classes={{ root: classes.fab }}>
            <PlusIcon />
          </Fab>
        </Tooltip>
      </Link>
    </Dashboard>
  );
}

export default ListSignoffs;
