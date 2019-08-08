import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import Code from '@mozilla-frontend-infra/components/Code';
import { makeStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import { formatDistanceStrict } from 'date-fns';
import ErrorPanel from '../../../components/ErrorPanel';
import Diff from '../../../components/Diff';
import DataTable from '../../../components/DataTable';
import Dashboard from '../../../components/Dashboard';
import Radio from '../../../components/Radio';
import Button from '../../../components/Button';
import useAction from '../../../hooks/useAction';
import { getRevisions, getRelease } from '../../../services/releases';
import { CONTENT_MAX_WIDTH } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
  radioCell: {
    paddingLeft: 0,
  },
  tableWrapper: {
    maxHeight: '50%',
    overflowY: 'auto',
  },
  tableHeadCell: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.common.white,
    zIndex: theme.zIndex.appBar,
  },
  drawerPaper: {
    maxWidth: CONTENT_MAX_WIDTH,
    margin: '0 auto',
    padding: theme.spacing(1),
    maxHeight: '60vh',
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
  const headers = ['Revision Date', 'Changed By', 'Compare', ''];
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
  const renderRow = (row, index) => (
    <TableRow key={row.timestamp}>
      <TableCell title={new Date(row.timestamp)}>
        {formatDistanceStrict(new Date(row.timestamp), new Date(), {
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>{row.changed_by}</TableCell>
      <TableCell className={classes.radioCell}>
        <Radio
          variant="red"
          value={index}
          disabled={index === 0}
          checked={leftRadioCheckedIndex === index}
          onChange={handleLeftRadioChange}
        />
        <Radio
          variant="green"
          value={index}
          disabled={index === revisions.length - 1}
          checked={rightRadioCheckedIndex === index}
          onChange={handleRightRadioChange}
        />
      </TableCell>
      <TableCell>
        <Button onClick={handleViewClick(row)}>View</Button>
        {index > 0 && <Button onClick={handleRestoreClick}>Restore</Button>}
      </TableCell>
    </TableRow>
  );

  return (
    <Dashboard title={`Release ${releaseName} Revisions`}>
      {error && <ErrorPanel fixed error={error} />}
      {isLoading && <Spinner loading />}
      {!isLoading && revisions.length === 1 && (
        <Typography>Role {releaseName} has no revisions</Typography>
      )}
      {!isLoading && revisions.length > 1 && (
        <Fragment>
          <div className={classes.tableWrapper}>
            <DataTable
              size="small"
              headers={headers}
              renderRow={renderRow}
              items={revisions}
              tableHeadCellProps={{ className: classes.tableHeadCell }}
            />
          </div>
          <br />
          <br />
          {leftRevisionData && rightRevisionData && (
            <Diff
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
