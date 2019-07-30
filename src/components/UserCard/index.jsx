import React, { Fragment } from 'react';
import { func, string, object } from 'prop-types';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import AccountGroupIcon from 'mdi-react/AccountGroupIcon';
import ArrowRightIcon from 'mdi-react/ArrowRightIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import PencilIcon from 'mdi-react/PencilIcon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '../Button';
import SignoffSummary from '../SignoffSummary';
import StatusLabel from '../StatusLabel';
import { withUser } from '../../utils/AuthContext';
import Link from '../../utils/Link';
import { LABELS } from '../../utils/constants';
import { getPermissionString, getRolesString } from '../../utils/userUtils';

const useStyles = makeStyles(theme => ({
  card: {
    listStyle: 'none',
  },
  cardHeader: {
    borderBottom: '1px gray dashed',
  },
  cardHeaderAction: {
    alignSelf: 'end',
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  pencilIcon: {
    marginRight: theme.spacing(1),
  },
  link: {
    ...theme.mixins.link,
  },
  arrowIcon: {
    margin: `0 ${theme.spacing(1)}px`,
  },
  propertyWithScheduledChange: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    borderRadius: '50%',
    background: 'red',
    marginLeft: theme.spacing(1),
    display: 'inline-block',
  },
}));

function getStatus(changeType) {
  switch (changeType) {
    case 'insert':
      return LABELS.PENDING_INSERT;
    case 'delete':
      return LABELS.PENDING_DELETE;
    default:
      return LABELS.PENDING;
  }
}

function User(props) {
  const classes = useStyles();
  const {
    user,
    className,
    username,
    roles,
    permissions,
    scheduledPermissions,
    onSignoff,
    onRevoke,
  } = props;
  const returnOptionIfExists = (options, key, defaultValue) => {
    if (options && options[key]) {
      return options[key];
    }

    return defaultValue;
  };

  return (
    <Card className={classNames(classes.card, className)}>
      <Link className={classes.link} to={`/users/${username}`}>
        <CardActionArea>
          <CardHeader
            classes={{ action: classes.cardHeaderAction }}
            className={classes.cardHeader}
            title={username}
            action={<PencilIcon className={classes.pencilIcon} />}
          />
        </CardActionArea>
      </Link>
      {/* We don't need to check roles here because users without permissions
            cannot hold roles */}
      {Object.keys(permissions).length > 0 && (
        <CardContent>
          <List>
            {Object.entries(permissions).map(([permission, details]) => (
              <ListItem key={permission}>
                <ListItemIcon>
                  <KeyVariantIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Fragment>
                      {getPermissionString(
                        permission,
                        returnOptionIfExists(details.options, 'actions', []),
                        returnOptionIfExists(details.options, 'products', [])
                      )}
                      {scheduledPermissions[permission] && (
                        <span className={classes.propertyWithScheduledChange} />
                      )}
                    </Fragment>
                  }
                />
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
      )}
      {Object.keys(scheduledPermissions).length > 0 &&
        Object.entries(scheduledPermissions).map(([permission, details]) => (
          <Fragment key={permission}>
            <Divider />
            <CardContent className={classes.scheduled}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <KeyVariantIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {permissions[permission] && (
                      <Fragment>
                        {getPermissionString(
                          permission,
                          returnOptionIfExists(
                            permissions[permission].options,
                            'actions',
                            []
                          ),
                          returnOptionIfExists(
                            permissions[permission].options,
                            'products',
                            []
                          )
                        )}
                        <ArrowRightIcon className={classes.arrowIcon} />
                      </Fragment>
                    )}
                    {getPermissionString(
                      permission,
                      returnOptionIfExists(details.options, 'actions', []),
                      returnOptionIfExists(details.options, 'products', []),
                      details.change_type
                    )}
                  </ListItemText>
                </ListItem>
              </List>
              <Grid container spacing={4}>
                <Grid item xs={4}>
                  <div>
                    <StatusLabel state={getStatus(details.change_type)} />
                  </div>
                </Grid>
                <Grid item xs={8}>
                  <SignoffSummary
                    requiredSignoffs={details.required_signoffs}
                    signoffs={details.signoffs}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions className={classes.cardActions}>
              {user && user.email in details.signoffs ? (
                <Button color="secondary" onClick={onRevoke}>
                  Revoke Signoff
                </Button>
              ) : (
                <Button color="secondary" onClick={onSignoff}>
                  Signoff
                </Button>
              )}
            </CardActions>
          </Fragment>
        ))}
    </Card>
  );
}

User.propTypes = {
  username: string.isRequired,
  roles: object,
  permissions: object,
  scheduledPermissions: object,
  onSignoff: func.isRequired,
  onRevoke: func.isRequired,
};

User.defaultProps = {
  roles: {},
  permissions: {},
  scheduledPermissions: {},
};

export default withUser(User);
