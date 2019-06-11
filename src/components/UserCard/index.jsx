import React from 'react';
import Card from '@material-ui/core/Card';
import GridListTile from '@material-ui/core/GridListTile';
import { makeStyles } from '@material-ui/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import PencilIcon from 'mdi-react/PencilIcon';
import Link from '../../utils/Link';

const useStyles = makeStyles(theme => ({
  card: {
    minWidth: '325px',
  },
  cardHeader: {
    borderBottom: '1px gray dashed',
  },
  cardHeaderAction: {
    alignSelf: 'end',
  },
  pencilIcon: {
    marginRight: theme.spacing(1),
  },
  roleless: {
    backgroundColor: 'red',
  },
}));

export default function User(props) {
  const classes = useStyles();
  const { username, roles, permissions } = props;

  // TODO: Add admin-or-not marker. Needs backend support.
  // should links like the ones below be in a component?
  return (
    <GridListTile>
      <Card className={classes.card}>
        <CardActionArea component={Link} to={`/users/${username}`}>
          <CardHeader
            classes={{ action: classes.cardHeaderAction }}
            className={classes.cardHeader}
            title={username}
            action={<PencilIcon className={classes.pencilIcon} />}
          />
        </CardActionArea>
        <CardContent>
          {Object.keys(roles).length === 0 && (
            <Chip className={classes.roleless} label="No Roles" />
          )}
          {Object.keys(roles).map(role => (
            <Chip
              key={role}
              label={role}
              component="a"
              href={`/roles/${role}`}
              clickable
            />
          ))}
        </CardContent>
      </Card>
    </GridListTile>
  );
}
