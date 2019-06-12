import React from 'react';
import Card from '@material-ui/core/Card';
import GridListTile from '@material-ui/core/GridListTile';
import { makeStyles } from '@material-ui/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import AccountGroupIcon from 'mdi-react/AccountGroupIcon';
import AccountSupervisorIcon from 'mdi-react/AccountSupervisorIcon';
import PencilIcon from 'mdi-react/PencilIcon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '../../utils/Link';
import { getPermissionString, getRolesString } from '../../utils/Users';

const useStyles = makeStyles(theme => ({
  card: {
    display: 'block',
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
  const returnOptionIfExists = (options, key, defaultValue) => {
    if (options && options[key]) {
      return options[key];
    }

    return defaultValue;
  };

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
          <List>
            {Object.entries(permissions).map(([permission, details]) => (
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
            {Object.keys(roles).length > 0 && (
              <ListItem>
                <ListItemIcon>
                  <AccountGroupIcon />
                </ListItemIcon>
                <ListItemText>
                  holds the {getRolesString(Object.keys(roles))}
                </ListItemText>
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>
    </GridListTile>
  );
}
