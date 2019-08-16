import React, { Fragment, useState, useEffect } from 'react';
import { clone } from 'ramda';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { makeStyles } from '@material-ui/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import { formatDistanceStrict } from 'date-fns';
import Dashboard from '../../../components/Dashboard';
import DataTable from '../../../components/DataTable';
import DialogAction from '../../../components/DialogAction';
import ErrorPanel from '../../../components/ErrorPanel';
import RuleCard from '../../../components/RuleCard';
import Radio from '../../../components/Radio';
import Button from '../../../components/Button';
import DiffRule from '../../../components/DiffRule';
import useAction from '../../../hooks/useAction';
import { getRevisions, addScheduledChange } from '../../../services/rules';
import {
  CONTENT_MAX_WIDTH,
  DIALOG_ACTION_INITIAL_STATE,
} from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
  radioCell: {
    paddingLeft: 0,
  },
  ruleCard: {
    boxShadow: 'unset',
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
  },
}));

function ListRuleRevisions(props) {
  const classes = useStyles();
  const [drawerState, setDrawerState] = useState({ open: false, item: {} });
  const [leftRadioCheckedIndex, setLeftRadioCheckedIndex] = useState(1);
  const [rightRadioCheckedIndex, setRightRadioCheckedIndex] = useState(0);
  const [dialogState, setDialogState] = useState(DIALOG_ACTION_INITIAL_STATE);
  const [fetchedRevisions, fetchRevisions] = useAction(getRevisions);
  const addSC = useAction(addScheduledChange)[1];
  const { ruleId } = props.match.params;
  // eslint-disable-next-line prefer-destructuring
  const error = fetchedRevisions.error;
  const isLoading = fetchedRevisions.loading;
  const revisions = fetchedRevisions.data
    ? fetchedRevisions.data.data.rules
    : [];
  const headers = ['Revision Date', 'Changed By', 'Compare', ''];

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

  const handleRestoreClick = revision => () =>
    setDialogState({
      ...dialogState,
      open: true,
      body: `Rule ${
        revision.alias ? revision.alias : revision.rule_id
      } will be reverted to data version ${revision.data_version}.`,
      title: 'Revert rule?',
      confirmText: 'Revert',
      item: revision,
    });
  const handleDialogSubmit = async () => {
    const ruleData = clone(dialogState.item);

    // We only want the actual rule data from the old revision,
    // not the metadata.
    delete ruleData.change_id;
    delete ruleData.changed_by;
    delete ruleData.timestamp;
    delete ruleData.data_version;
    const { error, data } = await addSC({
      change_type: 'update',
      when: new Date().getTime() + 5000,
      data_version: revisions[0].data_version,
      ...ruleData,
    });

    if (error) {
      throw error;
    }

    return data.data.sc_id;
  };

  const handleDialogClose = () => setDialogState(DIALOG_ACTION_INITIAL_STATE);
  const handleDialogActionComplete = scId =>
    props.history.push(`/rules#scId=${scId}`);
  const handleDialogError = error => setDialogState({ ...dialogState, error });
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
        {index > 0 && (
          <Button onClick={handleRestoreClick(row)}>Restore</Button>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <Dashboard title={`Rule ${ruleId} Revisions`}>
      {error && <ErrorPanel fixed error={error} />}
      {isLoading && <Spinner loading />}
      {!isLoading && revisions.length === 1 && (
        <Typography>Rule {ruleId} has no revisions</Typography>
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
      <DialogAction
        open={dialogState.open}
        title={dialogState.title}
        body={dialogState.body}
        confirmText={dialogState.confirmText}
        onSubmit={handleDialogSubmit}
        onError={handleDialogError}
        error={dialogState.error}
        onComplete={handleDialogActionComplete}
        onClose={handleDialogClose}
      />
    </Dashboard>
  );
}

export default ListRuleRevisions;
