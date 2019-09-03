import React from 'react';
import { bool, func, object } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import AlertIcon from 'mdi-react/AlertIcon';
import Button from '../Button';
import SignoffSummary from '../SignoffSummary';
import { withUser } from '../../utils/AuthContext';

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
  cardActions: {
    justifyContent: 'flex-end',
  },
}));

function EmergencyShutoffCard({
  emergencyShutoff,
  onEnableUpdates,
  onCancelEnable,
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
            {emergencyShutoff.scheduledChange
              ? 'Updates are scheduled to be enabled for this product and channel'
              : 'Updates are currently disabled for this product and channel'}
          </Typography>
        }
      />
      <CardContent classes={{ root: classes.cardContentRoot }}>
        {!readOnly && requiresSignoff && (
          <SignoffSummary
            requiredSignoffs={
              emergencyShutoff.scheduledChange.required_signoffs
            }
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
              onClick={() => onCancelEnable(emergencyShutoff)}>
              Keep Updates Disabled
            </Button>
          ) : (
            <Button
              color="secondary"
              disabled={!user}
              onClick={() => onEnableUpdates(emergencyShutoff)}>
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
            ))}
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
