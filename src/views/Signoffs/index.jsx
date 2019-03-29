import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import FileDocumentOutlineIcon from 'mdi-react/FileDocumentOutlineIcon';
import Dashboard from '../../components/Dashboard';

const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
  },
}));

function Signoffs() {
  const classes = useStyles();

  function handleSignoffEnable() {}

  return (
    <Dashboard>
      Signoffs
      <Tooltip title="Enable Signoff for a New Product">
        <Fab
          color="primary"
          className={classes.fab}
          classes={{ root: classes.fab }}
          onClick={handleSignoffEnable}>
          <FileDocumentOutlineIcon />
        </Fab>
      </Tooltip>
    </Dashboard>
  );
}

export default Signoffs;
