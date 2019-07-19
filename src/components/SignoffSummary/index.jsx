import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import { object } from 'prop-types';

const useStyles = makeStyles(theme => ({
  listSubheader: {
    lineHeight: 1.5,
    marginBottom: theme.spacing(1),
  },
  listWrapper: {
    display: 'flex',
  },
  requiresSignoffsList: {
    marginRight: theme.spacing(6),
  },
}));

function SignoffSummary(props) {
  const classes = useStyles();
  const { requiredSignoffs, signoffs } = props;
  const listOfSignoffs = Object.entries(signoffs);

  return (
    <div className={classes.listWrapper}>
      <List
        dense
        subheader={
          <ListSubheader className={classes.listSubheader}>
            Requires Signoffs From
          </ListSubheader>
        }>
        {Object.entries(requiredSignoffs).map(([role, count], index) => {
          const key = `${role}-${index}`;

          return (
            <ListItem key={key} dense className={classes.requiresSignoffsList}>
              <ListItemText
                primary={`${count} member${count > 1 ? 's' : ''} of ${role}`}
              />
            </ListItem>
          );
        })}
      </List>
      {listOfSignoffs && Boolean(listOfSignoffs.length) && (
        <List
          dense
          subheader={
            <ListSubheader className={classes.listSubheader}>
              Signed By
            </ListSubheader>
          }>
          <ListItem dense>
            {listOfSignoffs.map(([username, signoffRole]) => (
              <ListItemText
                key={username}
                primary={
                  <Fragment>
                    {username}
                    {' - '}
                    <Typography color="textSecondary" variant="caption">
                      {signoffRole}
                    </Typography>
                  </Fragment>
                }
              />
            ))}
          </ListItem>
        </List>
      )}
    </div>
  );
}

SignoffSummary.propTypes = {
  requiredSignoffs: object.isRequired,
  signoffs: object.isRequired,
};

export default SignoffSummary;
