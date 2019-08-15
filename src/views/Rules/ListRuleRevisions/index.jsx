import React, { Fragment, useState, useEffect } from 'react';
import { Column } from 'react-virtualized';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import { formatDistanceStrict } from 'date-fns';
import Dashboard from '../../../components/Dashboard';
import ErrorPanel from '../../../components/ErrorPanel';
import RuleCard from '../../../components/RuleCard';
import Radio from '../../../components/Radio';
import Button from '../../../components/Button';
import DiffRule from '../../../components/DiffRule';
import RevisionsTable from '../../../components/RevisionsTable';
import useAction from '../../../hooks/useAction';
import { getRevisions } from '../../../services/rules';
import { CONTENT_MAX_WIDTH } from '../../../utils/constants';

const useStyles = makeStyles({
  radioCell: {
    paddingLeft: 0,
  },
  ruleCard: {
    boxShadow: 'unset',
  },
  drawerPaper: {
    maxWidth: CONTENT_MAX_WIDTH,
    margin: '0 auto',
  },
});

function ListRuleRevisions(props) {
  const classes = useStyles();
  const [drawerState, setDrawerState] = useState({ open: false, item: {} });
  const [leftRadioCheckedIndex, setLeftRadioCheckedIndex] = useState(1);
  const [rightRadioCheckedIndex, setRightRadioCheckedIndex] = useState(0);
  const [fetchedRevisions, fetchRevisions] = useAction(getRevisions);
  const { ruleId } = props.match.params;
  // eslint-disable-next-line prefer-destructuring
  const error = fetchedRevisions.error;
  const isLoading = fetchedRevisions.loading;
  const revisions = fetchedRevisions.data
    ? fetchedRevisions.data.data.rules
    : [];
  const revisionsCount = revisions.length;

  useEffect(() => {
    fetchRevisions(ruleId);
  }, []);

  const handleLeftRadioChange = ({ target: { value } }) => {
    setLeftRadioCheckedIndex(Number(value));
  };

  const handleRightRadioChange = ({ target: { value } }) => {
    setRightRadioCheckedIndex(Number(value));
  };

  const handleDrawerClose = () => {
    setDrawerState({
      ...drawerState,
      open: false,
    });
  };

  const handleViewClick = item => () => {
    setDrawerState({
      ...drawerState,
      item,
      open: true,
    });
  };

  // TODO: Add logic to restore a revision
  const handleRestoreClick = () => {};

  return (
    <Dashboard title={`Rule ${ruleId} Revisions`}>
      {error && <ErrorPanel fixed error={error} />}
      {isLoading && <Spinner loading />}
      {!isLoading && revisions.length === 1 && (
        <Typography>Rule {ruleId} has no revisions</Typography>
      )}
      {!isLoading && revisionsCount > 1 && (
        <Fragment>
          <RevisionsTable
            rowCount={revisionsCount}
            rowGetter={({ index }) => revisions[index]}>
            <Column
              label="Revision Date"
              dataKey="timestamp"
              cellRenderer={({ cellData }) =>
                formatDistanceStrict(new Date(cellData), new Date(), {
                  addSuffix: true,
                })
              }
              width={250}
            />
            <Column width={250} label="Changed By" dataKey="changed_by" />
            <Column
              label="Compare"
              dataKey="compare"
              width={250}
              cellRenderer={({ rowIndex }) => (
                <Fragment>
                  <Radio
                    variant="red"
                    value={rowIndex}
                    disabled={rowIndex === 0}
                    checked={leftRadioCheckedIndex === rowIndex}
                    onChange={handleLeftRadioChange}
                  />
                  <Radio
                    variant="green"
                    value={rowIndex}
                    disabled={rowIndex === revisions.length - 1}
                    checked={rightRadioCheckedIndex === rowIndex}
                    onChange={handleRightRadioChange}
                  />
                </Fragment>
              )}
            />
            <Column
              dataKey="actions"
              width={250}
              cellRenderer={({ rowData, rowIndex }) => (
                <Fragment>
                  <Button onClick={handleViewClick(rowData)}>View</Button>
                  {rowIndex > 0 && (
                    <Button onClick={handleRestoreClick}>Restore</Button>
                  )}
                </Fragment>
              )}
            />
          </RevisionsTable>
          <br />
          <br />
          {revisions[leftRadioCheckedIndex] &&
            revisions[rightRadioCheckedIndex] && (
              <DiffRule
                firstRule={revisions[leftRadioCheckedIndex]}
                secondRule={revisions[rightRadioCheckedIndex]}
              />
            )}
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            anchor="bottom"
            open={drawerState.open}
            onClose={handleDrawerClose}>
            <RuleCard
              className={classes.ruleCard}
              readOnly
              rule={drawerState.item}
            />
          </Drawer>
        </Fragment>
      )}
    </Dashboard>
  );
}

export default ListRuleRevisions;
