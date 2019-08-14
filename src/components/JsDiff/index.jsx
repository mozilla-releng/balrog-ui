import React, { memo, useState, useEffect } from 'react';
import deepSortObject from 'deep-sort-object';
import { string, object } from 'prop-types';
import { createTwoFilesPatch } from 'diff';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import {
  NEW_LINES_REGEX,
  DIFF_COLORS,
  INITIAL_JS_DIFF_SUMMARY,
} from '../../utils/constants';

const useStyles = makeStyles(theme => ({
  pre: {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.5,
    display: 'inline-block',
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
    padding: theme.spacing(1),
  },
}));

/**
 * A component to display a diff in a similar fashion as `git diff`.
 * Useful when comparing JSON.
 */
function JsDiff(props) {
  const {
    firstObject,
    secondObject,
    firstFilename,
    secondFilename,
    className,
  } = props;
  const classes = useStyles();
  const [releaseLinesDiff, setReleaseDiffLines] = useState([]);
  const [diffSummary, setDiffSummary] = useState(INITIAL_JS_DIFF_SUMMARY);

  useEffect(() => {
    const releaseDiff = createTwoFilesPatch(
      firstFilename,
      secondFilename,
      JSON.stringify(deepSortObject(firstObject), null, 2),
      JSON.stringify(deepSortObject(secondObject), null, 2)
    );
    const lines = releaseDiff.split(NEW_LINES_REGEX);
    const diffSummary = lines.reduce((acc, curr) => {
      if (curr.startsWith('+') && !curr.startsWith('+++')) {
        return Object.assign(acc, { added: acc.added + 1 });
      }

      if (curr.startsWith('-') && !curr.startsWith('---')) {
        return Object.assign(acc, { removed: acc.removed + 1 });
      }

      return acc;
    }, INITIAL_JS_DIFF_SUMMARY);

    setReleaseDiffLines(lines);
    setDiffSummary(diffSummary);
  }, [firstFilename, secondFilename, firstObject, secondObject]);

  const handleRowRender = line => {
    // eslint-disable-next-line no-nested-ternary
    const backgroundColor = line.startsWith('+')
      ? DIFF_COLORS.ADDED
      : line.startsWith('-')
      ? DIFF_COLORS.REMOVED
      : 'unset';

    return (
      <div key={line} style={{ backgroundColor }}>
        <pre style={{ backgroundColor }} className={classes.pre}>
          {line}
        </pre>
      </div>
    );
  };

  return (
    Boolean(releaseLinesDiff.length) && (
      <Paper className={className}>
        <div className={classes.header}>
          <strong>
            <span className={classes.greenText}>+{diffSummary.added}</span>
          </strong>
          &nbsp;
          <strong>
            <span className={classes.redText}>-{diffSummary.removed}</span>
          </strong>
        </div>
        {releaseLinesDiff.length && (
          <div className={classes.listWrapper}>
            {releaseLinesDiff.map(handleRowRender)}
          </div>
        )}
      </Paper>
    )
  );
}

JsDiff.propTypes = {
  firstObject: object.isRequired,
  secondObject: object.isRequired,
  firstFilename: string.isRequired,
  secondFilename: string.isRequired,
  className: string,
};

JsDiff.defaultProps = {
  className: null,
};

export default memo(JsDiff);
