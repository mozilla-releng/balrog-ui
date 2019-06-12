import React from 'react';
import { makeStyles } from '@material-ui/styles';
import GridList from '@material-ui/core/GridList';
import UserCard from '../UserCard';

const useStyles = makeStyles(() => ({
  gridlist: {
    display: 'block',
  },
}));

export default function UserList(props) {
  const classes = useStyles();
  const { users } = props;

  return (
    <GridList className={classes.gridlist}>
      {Object.keys(users).map(user => (
        <UserCard
          key={user}
          username={user}
          roles={users[user].roles}
          permissions={users[user].permissions}
        />
      ))}
    </GridList>
  );
}
