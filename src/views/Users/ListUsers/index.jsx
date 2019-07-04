import React, { Fragment, useState, useEffect } from 'react';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import PlusIcon from 'mdi-react/PlusIcon';
import Dashboard from '../../../components/Dashboard';
import { getUsers } from '../../../services/users';
import useAction from '../../../hooks/useAction';
import UserCard from '../../../components/UserCard';
import getUserInfo from '../utils/getUserInfo';

const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
  },
}));

function ListUsers() {
  const classes = useStyles();
  const [users, setUsers] = useState({});
  const [usersAction, fetchUsers] = useAction(getUsers);
  const [userInfoAction, fetchUserInfo] = useAction(getUserInfo);
  const isLoading = usersAction.loading || userInfoAction.loading;
  const error = usersAction.error || userInfoAction.error;

  useEffect(() => {
    fetchUsers().then(({ data, error }) => {
      if (!error) {
        fetchUserInfo(Object.keys(data.data)).then(({ data, error }) => {
          if (!error) {
            setUsers(data);
          }
        });
      }
    });
  }, []);

  function handleUserAdd() {
    console.log('test');
  }

  return (
    <Dashboard title="Users">
      {isLoading && <Spinner loading />}
      {error && <ErrorPanel error={error} />}
      {!isLoading && users && (
        <Fragment>
          {Object.keys(users).map(user => (
            <UserCard
              key={user}
              username={user}
              roles={users[user].roles}
              permissions={users[user].permissions}
            />
          ))}
          <Tooltip title="Add Users">
            <Fab
              color="primary"
              className={classes.fab}
              classes={{ root: classes.fab }}
              onClick={handleUserAdd}>
              <PlusIcon />
            </Fab>
          </Tooltip>
        </Fragment>
      )}
    </Dashboard>
  );
}

export default ListUsers;
