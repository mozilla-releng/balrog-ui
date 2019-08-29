import React, { Fragment } from 'react';
import { bool, func, object } from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import AlertIcon from 'mdi-react/AlertIcon';
import UpdateIcon from 'mdi-react/UpdateIcon';
import PlusCircleIcon from 'mdi-react/PlusCircleIcon';
import HistoryIcon from 'mdi-react/HistoryIcon';
import { formatDistanceStrict } from 'date-fns';
import Button from '../Button';
import SignoffSummary from '../SignoffSummary';
import { withUser } from '../../utils/AuthContext';
import Link from '../../utils/Link';

const useStyles = makeStyles(theme => ({
  root: {
    '& h2, & h4': {
      '& .anchor-link-style': {
        textDecoration: 'none',
        opacity: 0,
        // To prevent the link to get the focus.
        display: 'none',
      },
      '&:hover .anchor-link-style': {
        display: 'inline-block',
        opacity: 1,
        color: theme.palette.text.hint,
        '&:hover': {
          color: theme.palette.text.secondary,
        },
      },
    },
  },
  space: {
    paddingTop: theme.spacing(2),
  },
  cardHeader: {
    paddingBottom: 0,
  },
  cardHeaderAvatar: {
    display: 'flex',
  },
  cardContentRoot: {
    padding: theme.spacing(1),
  },
  deletedText: {
    padding: theme.spacing(1),
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  textEllipsis: {
    ...theme.mixins.textEllipsis,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  scheduledChangesTitle: {
    padding: `0 ${theme.spacing(1)}px`,
  },
  diff: {
    fontSize: theme.typography.body2.fontSize,
    marginTop: theme.spacing(1),
  },
  chip: {
    height: theme.spacing(3),
  },
  chipIcon: {
    marginLeft: theme.spacing(1),
    marginBottom: 1,
  },
  deleteChip: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '& svg': {
      fill: theme.palette.error.contrastText,
    },
  },
  divider: {
    margin: `${theme.spacing(1)}px`,
  },
  scheduledChangesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  inline: {
    display: 'inline',
  },
  avatar: {
    height: theme.spacing(4),
    width: theme.spacing(4),
  },
  avatarText: {
    fontSize: 10,
  },
  comment: {
    maxHeight: theme.spacing(10),
    overflowY: 'auto',
  },
  propertyWithScheduledChange: {
    ...theme.mixins.redDot,
  },
  priorityScheduledChange: {
    marginLeft: -10,
    zIndex: 1,
  },
  primaryText: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    ...theme.mixins.link,
  },
}));

function EmergencyShutoffCard({
  emergencyShutoff,
  onSignoff,
  onRevoke,
  user,
  readOnly,
  onAuthorize,
  onUnauthorize,
  ...props
}) {
  const classes = useStyles();
  const requiresSignoff =
    emergencyShutoff.scheduledChange &&
    Object.keys(emergencyShutoff.scheduledChange.required_signoffs).length > 0;

  return (
    <Card classes={{ root: classes.root }} spacing={4} {...props}>
        <CardHeader
          classes={{ avatar: classes.cardHeaderAvatar }}
          className={classes.cardHeader}
          avatar={<AlertIcon />}
          title={
            <Typography component="h2" variant="h6">
              Updates are currently disabled for this product and channel.
            </Typography>
          }
        />
      <CardContent classes={{ root: classes.cardContentRoot }}>
        {emergencyShutoff.scheduledChange && (
          <Fragment>
            <div className={classes.scheduledChangesHeader}>
              <Typography
                className={classes.scheduledChangesTitle}
                component="h4"
                variant="subtitle1">
                Scheduled Changes
              </Typography>
              <Chip
                className={classes.deleteChip}
                icon={<AlertIcon className={classes.chipIcon} size={16} />}
                label={`${formatDistanceStrict(
                  emergencyShutoff.scheduledChange.when,
                  new Date(),
                  { addSuffix: true }
                )} (${emergencyShutoff.scheduledChange.change_type})`}
              />
            </div>
            <Typography
              className={classes.deletedText}
              variant="body2"
              color="textSecondary">
              Updates will be re-enabled.
            </Typography>
          </Fragment>
        )}
        {!readOnly && requiresSignoff && (
        <SignoffSummary
          requiredSignoffs={emergencyShutoff.scheduledChange.required_signoffs}
          signoffs={emergencyShutoff.scheduledChange.signoffs}
          className={classes.space}
        />
        )}
      </CardContent>
      {!readOnly && (
        <CardActions className={classes.cardActions}>
          {emergencyShutoff.scheduledChange ? (
          <Button
            color="secondary"
            disabled={!user}
            onClick={() => onCancelEnable(emergencySignoff)}>
            Keep Updates Disabled
          </Button>
          ) : (
          <Button
            color="secondary"
            disabled={!user}
            onClick={() => onEnableUpdates(emergencySignoff)}>
            Enable Updates
          </Button>
          )}
          {requiresSignoff &&
            (user && user.email in emergencyShutoff.scheduledChange.signoffs ? (
              <Button color="secondary" disabled={!user} onClick={onRevoke}>
                Revoke Signoff
              </Button>
            ) : (
              <Button color="secondary" disabled={!user} onClick={onSignoff}>
                Signoff
              </Button>
            ))
          }
        </CardActions>
      )}
    </Card>
  );
}

EmergencyShutoffCard.propTypes = {
  emergencyShutoff: object,
  // If true, the card will hide all buttons.
  readOnly: bool,
  // These are required if readOnly is false
  onSignoff: func,
  onRevoke: func,
};

EmergencyShutoffCard.defaultProps = {
  readOnly: false,
};

export default withUser(EmergencyShutoffCard);
