import React, { useMemo, useState, useEffect } from 'react';
import { object } from 'prop-types';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import VariableSizeList from '../VariableSizeList';
import DiffLinesWorker from '../../utils/diffLines.worker';
import { DIFF_COLORS, CONTENT_MAX_WIDTH } from '../../utils/constants';

const diffRowHeight = 19;
const useStyles = makeStyles(theme => ({
  pre: {
    margin: 0,
    // diffRowHeight should change accordingly if the
    // fontSize or lineHeight for pre element changes
    fontSize: 13,
    lineHeight: 1.5,
  },
  header: {
    height: theme.spacing(4),
    background: 'rgb(250, 251, 252)',
    borderBottom: '1px solid #e1e4e8',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: `0 ${theme.spacing(2)}px`,
  },
  greenText: {
    color: '#28a745',
  },
  redText: {
    color: '#cb2431',
  },
  listWrapper: {
    overflowX: 'auto',
  },
}));

/**
 * A component to display a diff in a similar fashion as `git diff`.
 * Useful when comparing JSON.
 */
function JsDiff(props) {
  const { firstObject, secondObject, className } = props;
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(false);
  const diffWorker = new DiffLinesWorker();

  diffWorker.onmessage = e => {
    const items = JSON.parse(e.data);
    const display = items.some(item => item.added || item.removed);

    setItems(items);
    setDisplay(display);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    diffWorker.postMessage([
      JSON.stringify(firstObject, null, 2),
      JSON.stringify(secondObject, null, 2),
    ]);
  }, [firstObject, secondObject]);

  const handleRowRender = ({ index, key, style }) => {
    const item = items[index];
    // eslint-disable-next-line no-nested-ternary
    const backgroundColor = item.added
      ? DIFF_COLORS.ADDED
      : item.removed
      ? DIFF_COLORS.REMOVED
      : 'unset';
    // eslint-disable-next-line no-nested-ternary
    const symbol = item.added ? '+' : item.removed ? '-' : ' ';

    return (
      <div key={key} style={{ backgroundColor, ...style }}>
        {item.lines.map((line, index) => {
          const key = `${line}-${index}`;

          return (
            <pre key={key} className={classes.pre}>
              {` ${symbol} ${line}`}
            </pre>
          );
        })}
      </div>
    );
  };

  const getRowHeight = ({ index }) => {
    const item = items[index];

    return item.count * diffRowHeight;
  };

  const summarizedDiff = useMemo(() => {
    const result = {
      added: 0,
      removed: 0,
    };

    if (!items.length) {
      return result;
    }

    items.forEach(item => {
      if (item.added) {
        result.added += item.count;
      } else if (item.removed) {
        result.removed += item.count;
      }
    });

    return result;
  }, [items]);

  return loading ? (
    <Spinner className={className} loading />
  ) : (
    display && (
      <Paper className={className}>
        <div className={classes.header}>
          <strong>
            <span className={classes.greenText}>+{summarizedDiff.added}</span>
          </strong>
          &nbsp;
          <strong>
            <span className={classes.redText}>-{summarizedDiff.removed}</span>
          </strong>
        </div>
        <div className={classes.listWrapper}>
          <VariableSizeList
            rowRenderer={handleRowRender}
            rowHeight={getRowHeight}
            rowCount={items.length}
            width={CONTENT_MAX_WIDTH + 1000}
          />
        </div>
      </Paper>
    )
  );
}

JsDiff.propTypes = {
  firstObject: object.isRequired,
  secondObject: object.isRequired,
  className: object,
};

JsDiff.defaultProps = {
  className: null,
};

export default JsDiff;
