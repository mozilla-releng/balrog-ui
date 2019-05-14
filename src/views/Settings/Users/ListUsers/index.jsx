import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import PlusIcon from 'mdi-react/PlusIcon';
import Dashboard from '../../../../components/Dashboard';
import SettingsNav from '../../../../components/SettingsNav';
import { getUsers } from '../../../../utils/Users';
import tryCatch from '../../../../utils/tryCatch';
import UserList from '../../../../components/UserList';

const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
  },
}));

function ListUsers() {
  const classes = useStyles();
  const [users, setUsers] = useState({});

  useEffect(() => {
    (async () => {
      const [error, result] = await tryCatch(getUsers());

      if (error !== null) {
        // TODO: what's the proper way of handling this?
        console.log(error);
      } else {
        setUsers(result.data);
      }
    })();
  }, []);

  function handleUserAdd() {
    console.log('test');
  }

  return (
    <Dashboard sidenav={<SettingsNav />}>
      <Typography variant="subtitle1">Users</Typography>
      <UserList users={users} />
      <Tooltip title="Add Users">
        <Fab
          color="primary"
          className={classes.fab}
          classes={{ root: classes.fab }}
          onClick={handleUserAdd}>
          <PlusIcon />
        </Fab>
      </Tooltip>
    </Dashboard>
  );
}

export default ListUsers;
