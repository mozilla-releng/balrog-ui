import React, { Fragment } from 'react';
import { object } from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  listSubheader: {
    lineHeight: 1.5,
    marginBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
  },
  listWrapper: {
    display: 'flex',
  },
  listItemText: {
    marginBottom: 0,
    marginTop: 0,
  },
  signoffsList: {
    marginRight: theme.spacing(6),
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

function SignoffSummary(props) {
  const classes = useStyles();
  const { requiredSignoffs, signoffs, className } = props;
  const listOfSignoffs = Object.entries(signoffs);

  return (
    <div className={classNames(classes.listWrapper, className)}>
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
            <ListItem key={key} className={classes.signoffsList}>
              <ListItemText
                primary={
                  <Typography>{`${count} member${
                    count > 1 ? 's' : ''
                  } of ${role}`}</Typography>
                }
                className={classes.listItemText}
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
          <ListItem className={classes.signoffsList}>
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
                className={classes.listItemText}
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
  className: object,
};

SignoffSummary.defaultProps = {
  className: null,
};

export default SignoffSummary;
