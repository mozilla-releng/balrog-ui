import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import PlusIcon from 'mdi-react/PlusIcon';
import Dashboard from '../../../components/Dashboard';
import Link from '../../../utils/Link';

const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
  },
}));

function ListRules() {
  const classes = useStyles();
  const [showScheduled, setScheduled] = useState(true);

  function handleSwitchChange() {
    setScheduled(!showScheduled);
  }

  return (
    <Dashboard>
      <Typography variant="subtitle1">Rules</Typography>
      <FormControlLabel
        control={
          <Switch
            color="primary"
            checked={showScheduled}
            onChange={handleSwitchChange}
          />
        }
        label="Scheduled"
      />
      <Link to="/rules/create">
        <Tooltip title="Add Rule">
          <Fab color="primary" className={classes.fab}>
            <PlusIcon />
          </Fab>
        </Tooltip>
      </Link>
    </Dashboard>
  );
}

export default ListRules;
