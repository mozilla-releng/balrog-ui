import React, { Fragment } from 'react';
import { bool, func, string } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import WarningIcon from 'mdi-react/WarningIcon';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
}));

function EmergencyShutoffPanel(props) {
  const classes = useStyles();
  const { product, channel, shutoff, onShutoff, onRestore } = props;

  return (
    <Typography>
      {shutoff
        ? (
          <Fragment>
            <WarningIcon />
              Updates are currently disabled for this product and channel.
              Click to 
              <Button color="secondary" onClick={onRestore}>enable</Button>
          </Fragment>
        )
        :
          <Fragment>
            Click to
            <Button color="secondary" onClick={onShutoff}>disable</Button>
            updates
          </Fragment>
      }
    </Typography>
  );
}

EmergencyShutoffPanel.propTypes = {
  product: string.isRequired,
  channel: string.isRequired,
  shutoff: bool.isRequired,
  onShutoff: func.isRequired,
  onRestore: func.isRequired,
};

export default EmergencyShutoffPanel;
