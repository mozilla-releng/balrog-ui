import React, { useRef, Fragment } from 'react';
import { node } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { WindowScroller } from 'react-virtualized';
import { VariableSizeList as List } from 'react-window';

const useStyles = makeStyles({
  windowScrollerOverride: {
    height: '100% !important',
    overflow: 'inherit !important',
  },
});

function VirtualizedList(props) {
  const { children, ...rest } = props;
  const classes = useStyles();
  const listRef = useRef(null);
  const handleScroll = ({ scrollTop }) => {
    listRef.current.scrollTo(scrollTop);
  };

  const handleListScroll = ({ scrollOffset, scrollUpdateWasRequested }) => {
    // scrollUpdateWasRequested is a boolean.
    // This value is true if the scroll was caused by scrollToItem(),
    // and false if it was the result of a user interaction in the browser.
    if (scrollUpdateWasRequested) {
      window.scrollTo(0, scrollOffset);
    }
  };

  return (
    <Fragment>
      <WindowScroller onScroll={handleScroll}>{() => null}</WindowScroller>
      <List
        className={classes.windowScrollerOverride}
        ref={listRef}
        height={window.innerHeight}
        estimatedItemSize={400}
        overscanCount={5}
        onScroll={handleListScroll}
        {...rest}>
        {children}
      </List>
    </Fragment>
  );
}

VirtualizedList.propTypes = {
  // React component responsible for rendering the individual item specified
  // by an index prop. This component also receives a style
  // prop (used for positioning).
  children: node.isRequired,
};

export default VirtualizedList;
