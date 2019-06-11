import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import AccountGroupIcon from 'mdi-react/AccountGroupIcon';
import AccountSupervisorIcon from 'mdi-react/AccountSupervisorIcon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import Dashboard from '../../../components/Dashboard';
import {
  getUserInfo,
  getPermissionString,
  getRolesString,
} from '../../../utils/Users';
import tryCatch from '../../../utils/tryCatch';

function User(props) {
  const {
    match: {
      params: { username },
    },
  } = props;
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const returnOptionIfExists = (options, key, defaultValue) => {
    if (options && options[key]) {
      return options[key];
    }

    return defaultValue;
  };

  useEffect(() => {
    (async () => {
      const [error, result] = await tryCatch(getUserInfo(username));

      if (error) {
        setError(error);

        return;
      }

      setUser(result.data);
    })();
  }, []);

  return (
    <Dashboard title="Users">
      {error && <ErrorPanel error={error} />}
      {!error && !user && <Spinner loading />}
      {user && <Typography variant="h4">{user.username}…</Typography>}
      <List>
        {user &&
          Object.entries(user.permissions).map(([permission, details]) => (
            <ListItem key={permission}>
              <ListItemIcon>
                <AccountSupervisorIcon />
              </ListItemIcon>
              <ListItemText>
                {getPermissionString(
                  permission,
                  returnOptionIfExists(details.options, 'actions', []),
                  returnOptionIfExists(details.options, 'products', [])
                )}
              </ListItemText>
            </ListItem>
          ))}
        {user && Object.keys(user.roles).length > 0 && (
          <ListItem>
            <ListItemIcon>
              <AccountGroupIcon />
            </ListItemIcon>
            {/* TODO: Should these be inside of a Chip like on the UserCards */}
            <ListItemText>
              {user.username} holds the
              {getRolesString(Object.keys(user.roles))}
            </ListItemText>
          </ListItem>
        )}
      </List>
    </Dashboard>
  );
}

export default User;
