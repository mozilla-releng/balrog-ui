import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import Code from '@mozilla-frontend-infra/components/Code';
import { makeStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import { formatDistanceStrict } from 'date-fns';
import ErrorPanel from '../../../components/ErrorPanel';
import Dashboard from '../../../components/Dashboard';
import Radio from '../../../components/Radio';
import Button from '../../../components/Button';
import useAction from '../../../hooks/useAction';
import { getRevisions, getRelease } from '../../../services/releases';
import { CONTENT_MAX_WIDTH } from '../../../utils/constants';
import JsDiff from '../../../components/JsDiff';

const useStyles = makeStyles(theme => ({
  radioCell: {
    paddingLeft: 0,
  },
  drawerPaper: {
    maxWidth: CONTENT_MAX_WIDTH,
    margin: '0 auto',
    padding: theme.spacing(1),
    maxHeight: '80vh',
  },
  tableHeader: {
    textTransform: 'none',
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(12),
    lineHeight: theme.typography.pxToRem(21),
    fontWeight: theme.typography.fontWeightMedium,
    '& > [title="Compare"]': {
      marginLeft: theme.spacing(2),
    },
  },
  jsDiff: {
    margin: `${theme.spacing(5)}px 0`,
  },
}));

function ListReleaseRevisions(props) {
  const classes = useStyles();
  const [fetchedRevisions, fetchRevisions] = useAction(getRevisions);
  const [fetchedRelease, fetchRelease] = useAction(getRelease);
  const [fetchedRevisionData, fetchRevisionData] = useAction(axios.get);
  const [drawerState, setDrawerState] = useState({ open: false, item: {} });
  const [leftRadioCheckedIndex, setLeftRadioCheckedIndex] = useState(1);
  const [leftRevisionData, setLeftRevisionData] = useState(null);
  const [rightRadioCheckedIndex, setRightRadioCheckedIndex] = useState(0);
  const [rightRevisionData, setRightRevisionData] = useState(null);
  const error =
    fetchedRelease.error || fetchedRevisions.error || fetchedRevisionData.error;
  const isLoading = fetchedRelease.loading || fetchedRevisions.loading;
  const revisions = fetchedRevisions.data ? fetchedRevisions.data : [];
  const { releaseName } = props.match.params;

  useEffect(() => {
    fetchRelease(releaseName);
  }, [releaseName]);

  useEffect(() => {
    if (fetchedRelease.data) {
      fetchRevisions(releaseName, fetchedRelease.data.data.product);
    }
  }, [releaseName, fetchedRelease.data]);

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

  const handleViewClick = item => async () => {
    const result = await fetchRevisionData(item.data_url);

    setDrawerState({
      ...drawerState,
      item: result.data.data,
      open: true,
    });
  };

  useEffect(() => {
    const r = revisions[leftRadioCheckedIndex];

    if (r) {
      axios.get(r.data_url).then(result => {
        setLeftRevisionData(result.data || {});
      });
    }
  }, [revisions, leftRadioCheckedIndex]);

  useEffect(() => {
    const r = revisions[rightRadioCheckedIndex];

    if (r) {
      axios.get(r.data_url).then(result => {
        setRightRevisionData(result.data || {});
      });
    }
  }, [revisions, rightRadioCheckedIndex]);

  // TODO: Add logic to restore a revision
  const handleRestoreClick = () => {};

  return (
    <Dashboard title={`Release ${releaseName} Revisions`}>
      {error && <ErrorPanel fixed error={error} />}
      {isLoading && <Spinner loading />}
      {!isLoading && revisions.length === 1 && (
        <Typography>Role {releaseName} has no revisions</Typography>
      )}
      {!isLoading && revisions.length > 1 && (
        <Fragment>
          <AutoSizer disableHeight>
            {({ width }) => (
              <Table
                headerClassName={classes.tableHeader}
                overscanRowCount={50}
                width={width}
                height={400}
                headerHeight={20}
                rowHeight={40}
                rowCount={revisions.length}
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
              </Table>
            )}
          </AutoSizer>
          {leftRevisionData && rightRevisionData && (
            <JsDiff
              className={classes.jsDiff}
              firstObject={leftRevisionData || {}}
              secondObject={rightRevisionData || {}}
            />
          )}
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            anchor="bottom"
            open={drawerState.open}
            onClose={handleDrawerClose}>
            <Code language="json">
              {JSON.stringify(drawerState.item, null, 2)}
            </Code>
          </Drawer>
        </Fragment>
      )}
    </Dashboard>
  );
}

export default ListReleaseRevisions;
