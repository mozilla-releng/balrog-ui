import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import GroupWork from '@material-ui/icons/GroupWork';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Dashboard from '../../../../components/Dashboard';
import SettingsNav from '../../../../components/SettingsNav';
import { getUserInfo, permissionStrings } from '../../../../utils/Users';
import tryCatch from '../../../../utils/tryCatch';

function User(props) {
  const {
    match: {
      params: { username },
    },
  } = props;
  const [user, setUser] = useState({ permissions: {}, roles: {} });

  useEffect(() => {
    (async () => {
      const [error, result] = await tryCatch(getUserInfo(username));

      if (error !== null) {
        // TODO: what's the proper way of handling this?
        console.log(error);
      } else {
        setUser(result.data);
      }
    })();
  }, []);

  return (
    <Dashboard sidenav={<SettingsNav />}>
      <Typography variant="h4">{user.username}…</Typography>
      <List>
        {Object.keys(user.permissions).map(permission => {
          const actionStr = 'perform any action';
          const productStr = 'for all products';
          const words = permissionStrings(productStr, actionStr);

          return (
            <ListItem key={permission}>
              <ListItemIcon>
                <SupervisorAccount />
              </ListItemIcon>
              <ListItemText>{words[permission]}</ListItemText>
            </ListItem>
          );
        })}
        {Object.keys(user.roles).map(role => (
          <ListItem key={role}>
            <ListItemIcon>
              <GroupWork />
            </ListItemIcon>
            <ListItemText>
              {user.username} has {role}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Dashboard>
  );
}

export default User;
