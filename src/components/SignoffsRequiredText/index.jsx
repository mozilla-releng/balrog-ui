import React from 'react';
import { object } from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  requireSignoffWarning: {
    color: theme.palette.warning.dark,
    'font-weight': 'bold',
  },
}));

function SignoffsRequiredText(props) {
  const classes = useStyles();
  const { requiredSignoffs } = props;

  return (
    <Typography component="p" className={classes.requireSignoffWarning}>
      This changes requires signoffs:&nbsp;
      {Object.entries(requiredSignoffs)
        .map(([role, count]) => `${count} from ${role}`)
        .join(', ')}
      .
    </Typography>
  );
}

SignoffsRequiredText.propTypes = {
  requiredSignoffs: object.isRequired,
};

export default SignoffsRequiredText;
