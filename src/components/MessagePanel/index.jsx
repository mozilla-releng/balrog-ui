import React, { useState } from 'react';
import { func, oneOfType, bool, string, object } from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import MuiErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import { CONTENT_MAX_WIDTH } from '../../utils/constants';

const useStyles = makeStyles(theme => ({
  fixed: {
    position: 'fixed',
    zIndex: theme.zIndex.snackbar,
    left: '50%',
    right: '50%',
    transform: 'translateX(-50%)',
    width: '92%',
    maxWidth: CONTENT_MAX_WIDTH,
  },
}));

export default function MessagePanel({
  className,
  message,
  fixed,
  onClose,
  unclosable,
  ...props
}) {
  const classes = useStyles();
  const [currentMessage, setCurrentMessage] = useState(null);
  const [previousMessage, setPreviousMessage] = useState(null);
  const otherProps = {};
  const handleErrorClose = () => {
    setCurrentMessage(null);

    if (onClose) {
      onClose();
    }
  };

  if (message !== previousMessage) {
    setCurrentMessage(message);
    setPreviousMessage(message);
  }

  if (unclosable) {
    otherProps.onClose = null;
  }

  return currentMessage ? (
    <MuiErrorPanel
      className={classNames(className, {
        [classes.fixed]: fixed,
      })}
      error={currentMessage}
      onClose={handleErrorClose}
      {...otherProps}
      {...props}
    />
  ) : null;
}

MessagePanel.propTypes = {
  /** Message to display. */
  message: oneOfType([string, object]),
  /** If true, the component will be fixed. */
  fixed: bool,
  className: string,
  onClose: func,
  /**
   * If true, the component will not have the close button,
   * therefore unclosable.
   * */
  unclosable: bool,
};

MessagePanel.defaultProps = {
  className: null,
  message: null,
  fixed: false,
  onClose: null,
};
