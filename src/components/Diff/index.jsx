import React, { useMemo } from 'react';
import { object, oneOf } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { diffLines, formatLines } from 'unidiff';
import { Diff as ReactDiff, Hunk, parseDiff } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import getDiff from '../../utils/diff';
import getDiffedProperties from '../../utils/getDiffedProperties';
import { RULE_DIFF_PROPERTIES } from '../../utils/constants';

const useStyles = makeStyles(theme => ({
  diff: {
    fontSize: theme.typography.body2.fontSize,
    marginTop: theme.spacing(1),
    display: 'block',
    overflowX: 'auto',
    '& .diff-code': {
      whiteSpace: 'pre',
    },
    '& colgroup': {
      width: '100%',
    },
  },
}));

function Diff(props) {
  const classes = useStyles();
  const { type, firstObject, secondObject } = props;
  const diffProperties = type => {
    switch (type) {
      case 'rule': {
        return RULE_DIFF_PROPERTIES;
      }

      default: {
        return Array.from(
          new Set([...Object.keys(firstObject), ...Object.keys(secondObject)])
        );
      }
    }
  };

  const diffedProperties = getDiffedProperties(
    diffProperties(type),
    firstObject,
    secondObject
  );
  const diff = useMemo(() => {
    const [oldText, newText] = getDiff(
      diffedProperties,
      firstObject,
      secondObject
    );
    const diffText = formatLines(diffLines(oldText, newText), {
      context: 0,
    });
    const [diff] = parseDiff(diffText, { nearbySequences: 'zip' });

    return diff;
  }, [firstObject, secondObject]);

  return diff && diff.type ? (
    <ReactDiff
      className={classes.diff}
      viewType="split"
      diffType={diff.type}
      hunks={diff.hunks || []}>
      {hunks => hunks.map(hunk => <Hunk key={hunk.content} hunk={hunk} />)}
    </ReactDiff>
  ) : null;
}

Diff.propTypes = {
  firstObject: object.isRequired,
  secondObject: object.isRequired,
  // If type is not defined, then all object keys will be used when diffing
  type: oneOf(['rule']),
};

Diff.defaultProps = {
  type: null,
};

export default Diff;
