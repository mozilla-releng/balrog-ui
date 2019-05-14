import React from 'react';
import GridList from '@material-ui/core/GridList';
import User from '../User';

export default function UserList(props) {
  const { users } = props;

  return (
    <GridList>
      {Object.keys(users).map(user => (
        <User key={user} username={user} roles={users[user].roles} />
      ))}
    </GridList>
  );
}
