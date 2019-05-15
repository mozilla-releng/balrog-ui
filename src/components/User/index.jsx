import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import GridListTile from '@material-ui/core/GridListTile';
import { makeStyles } from '@material-ui/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles(() => ({
  card: {
    minWidth: '250px',
    maxWidth: '250px',
  },
  roleless: {
    backgroundColor: 'red',
  },
}));

export default function User(props) {
  const classes = useStyles();
  const { username, roles } = props;

  // TODO: Add admin-or-not marker. Needs backend support.
  // should links like the ones below be in a component?
  return (
    <GridListTile>
      <Card className={classes.card}>
        <CardHeader
          title={username}
          action={
            <Link to={`/users/${username}`}>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Link>
          }
        />
        <CardContent>
          {roles.length === 0 && (
            <Chip className={classes.roleless} label="No Roles" />
          )}
          {roles.map(role => (
            <Chip
              key={role.role}
              label={role.role}
              component="a"
              href={`/roles/${role.role}`}
              clickable
            />
          ))}
        </CardContent>
      </Card>
    </GridListTile>
  );
}
