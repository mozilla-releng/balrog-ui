import React from 'react';
import GridList from '@material-ui/core/GridList';
import UserCard from '../UserCard';

export default function UserList(props) {
  const { users } = props;

  return (
    <GridList cols={1}>
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
