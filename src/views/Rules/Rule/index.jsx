import React, { Fragment, useState, useEffect } from 'react';
import classNames from 'classnames';
import { bool } from 'prop-types';
import { defaultTo, assocPath } from 'ramda';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/styles';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import ContentSaveIcon from 'mdi-react/ContentSaveIcon';
import DeleteIcon from 'mdi-react/DeleteIcon';
import Dashboard from '../../../components/Dashboard';
import AutoCompleteText from '../../../components/AutoCompleteText';
import getSuggestions from '../../../components/AutoCompleteText/getSuggestions';
import DateTimePicker from '../../../components/DateTimePicker';
import SpeedDial from '../../../components/SpeedDial';
import useAction from '../../../hooks/useAction';
import {
  getScheduledChange,
  getRule,
  getProducts,
  getChannels,
  addScheduledChange,
  updateScheduledChange,
} from '../../../services/rules';
import { getReleaseNames } from '../../../services/releases';
import { EMPTY_MENU_ITEM_CHAR } from '../../../utils/constants';

const initialRule = {
  alias: '',
  backgroundRate: 0,
  buildID: '',
  buildTarget: '',
  channel: '',
  comment: '',
  distVersion: '',
  distribution: '',
  fallbackMapping: '',
  headerArchitecture: '',
  instructionSet: '',
  jaws: EMPTY_MENU_ITEM_CHAR,
  locale: '',
  mapping: '',
  memory: '',
  mig64: EMPTY_MENU_ITEM_CHAR,
  osVersion: '',
  priority: 0,
  product: '',
  update_type: '',
  version: '',
};
const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
  },
  secondFab: {
    ...theme.mixins.fab,
    right: theme.spacing(12),
  },
  scheduleDiv: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  scheduleIcon: {
    marginRight: theme.spacing(3),
  },
}));

export default function Rule({ isNewRule, ...props }) {
  const classes = useStyles();
  const [rule, setRule] = useState(
    props.location.state && props.location.state.rule
      ? props.location.state.rule
      : initialRule
  );
  const [scheduledChange, setScheduledChange] = useState(null);
  const [products, fetchProducts] = useAction(getProducts);
  const [channels, fetchChannels] = useAction(getChannels);
  const [releaseNames, fetchReleaseNames] = useAction(getReleaseNames);
  // 30 seconds - to make sure the helper text "Scheduled for ASAP" shows up
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [dateTimePickerError, setDateTimePickerError] = useState(null);
  const [fetchRuleAction, fetchRule] = useAction(getRule);
  const [scheduledChangeAction, fetchScheduledChange] = useAction(getScheduledChange);
  const [addSCAction, addSC] = useAction(addScheduledChange);
  const [updateSCAction, updateSC] = useAction(updateScheduledChange);
  const isLoading =
    fetchRuleAction.loading || scheduledChangeAction.loading || products.loading || channels.loading;
  const error = fetchRuleAction.error || scheduledChangeAction.error || addSCAction.error || updateSCAction.error;
  const { ruleId } = props.match.params;
  const defaultToEmptyString = defaultTo('');
  const handleInputChange = ({ target: { name, value } }) => {
    setRule(assocPath([name], value, rule));
  };

  const handleProductChange = value =>
    setRule(assocPath(['product'], value, rule));
  const handleChannelChange = value =>
    setRule(assocPath(['channel'], value, rule));
  const handleMappingChange = value =>
    setRule(assocPath(['mapping'], value, rule));
  const handleFallbackMappingChange = value =>
    setRule(assocPath(['fallbackMapping'], value, rule));
  const handleNumberChange = name => ({ floatValue: value }) => {
    setRule(assocPath([name], value, rule));
  };

  const handleDateTimeChange = date => {
    setScheduleDate(date);
    setDateTimePickerError(null);
  };

  const handleDateTimePickerError = error => {
    setDateTimePickerError(error);
  };

  // TODO: Add logic for actions
  const handleScheduleChangeDelete = () => {};
  const handleCreateRule = () => {};

  const handleUpdateRule = async () => {
    const now = new Date();
    const when = scheduleDate >= now ? scheduleDate.getTime() : now.getTime() + 5000;
    if (scheduledChange) {
      await updateSC({
        scId: scheduledChange.sc_id,
        scDataVersion: scheduledChange.sc_data_version,
        when,
        alias: scheduledChange.alias,
        backgroundRate: scheduledChange.backgroundRate,
        buildID: scheduledChange.buildID,
        buildTarget: scheduledChange.buildTarget,
        channel: scheduledChange.channel,
        comment: scheduledChange.comment,
        data_version: scheduledChange.data_version,
        distVersion: scheduledChange.distVersion,
        distribution: scheduledChange.distribution,
        fallbackMapping: scheduledChange.fallbackMapping,
        headerArchitecture: scheduledChange.headerArchitecture,
        instructionSet: scheduledChange.instructionSet,
        jaws: scheduledChange.jaws,
        locale: scheduledChange.locale,
        mapping: scheduledChange.mapping,
        memory: scheduledChange.memory,
        mig64: scheduledChange.mi64,
        osVersion: scheduledChange.osVersion,
        priority: scheduledChange.priority,
        product: scheduledChange.product,
        update_type: scheduledChange.update_type,
        version: scheduledChange.version,
      });
    } else {
      await addSC({
        ruleId: rule.rule_id,
        dataVersion: rule.data_version,
        change_type: 'update',
        when,
        alias: rule.alias,
        backgroundRate: rule.backgroundRate,
        buildID: rule.buildID,
        buildTarget: rule.buildTarget,
        channel: rule.channel,
        comment: rule.comment,
        distVersion: rule.distVersion,
        distribution: rule.distribution,
        fallbackMapping: rule.fallbackMapping,
        headerArchitecture: rule.headerArchitecture,
        instructionSet: rule.instructionSet,
        jaws: rule.jaws,
        locale: rule.locale,
        mapping: rule.mapping,
        memory: rule.memory,
        mig64: rule.mi64,
        osVersion: rule.osVersion,
        priority: rule.priority,
        product: rule.product,
        update_type: rule.update_type,
        version: rule.version,
      });
    }
    // no error, redirect back to rules
    props.history.push('/rules');
  };

  useEffect(() => {
    if (!isNewRule) {
      Promise.all([
        fetchRule(ruleId),
        fetchScheduledChange(ruleId),
        fetchProducts(),
        fetchChannels(),
        fetchReleaseNames(),
      ]).then(
        // eslint-disable-next-line no-unused-vars
        ([fetchedRuleResponse, fetchedScheduledChangeResponse]) => {
          setRule({
            ...rule,
            ...fetchedRuleResponse.data.data,
          });
          if (fetchedScheduledChangeResponse.data.data.count > 0) {
            setScheduledChange(fetchedScheduledChangeResponse.data.data.scheduled_changes[0]);
          }
        }
      );
    } else {
      Promise.all([fetchProducts(), fetchChannels(), fetchReleaseNames()]);
    }
  }, [ruleId]);
  const today = new Date();

  // This will make sure the helperText
  // will always be displayed for a "today" date
  today.setHours(0, 0, 0, 0);

  return (
    <Dashboard
      title={
        isNewRule
          ? 'Create Rule'
          : `Update Rule ${ruleId}${rule.alias ? ` (${rule.alias})` : ''}`
      }>
      {isLoading && <Spinner loading />}
      {error && <ErrorPanel error={error} />}
      {!isLoading && (
        <Fragment>
          <div className={classes.scheduleDiv}>
            <DateTimePicker
              todayLabel="ASAP"
              disablePast
              inputVariant="outlined"
              fullWidth
              label="When"
              onError={handleDateTimePickerError}
              helperText={
                dateTimePickerError ||
                (scheduleDate < new Date()
                  ? 'This will be scheduled for ASAP'
                  : undefined)
              }
              onDateTimeChange={handleDateTimeChange}
              value={scheduleDate}
            />
          </div>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <AutoCompleteText
                value={defaultToEmptyString(rule.product)}
                onValueChange={handleProductChange}
                getSuggestions={
                  products.data && getSuggestions(products.data.data.product)
                }
                label="Product"
                required
                inputProps={{
                  autoFocus: true,
                  fullWidth: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AutoCompleteText
                value={defaultToEmptyString(rule.channel)}
                onValueChange={handleChannelChange}
                getSuggestions={
                  channels.data && getSuggestions(channels.data.data.channel)
                }
                label="Channel"
                required
                inputProps={{
                  fullWidth: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AutoCompleteText
                value={defaultToEmptyString(rule.mapping)}
                onValueChange={handleMappingChange}
                getSuggestions={
                  releaseNames.data &&
                  getSuggestions(releaseNames.data.data.names)
                }
                label="Mapping"
                required
                inputProps={{
                  fullWidth: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AutoCompleteText
                value={defaultToEmptyString(rule.fallbackMapping)}
                onValueChange={handleFallbackMappingChange}
                getSuggestions={
                  releaseNames.data &&
                  getSuggestions(releaseNames.data.data.names)
                }
                label="Fallback Mapping"
                required
                inputProps={{
                  fullWidth: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NumberFormat
                allowNegative={false}
                label="Background Rate"
                fullWidth
                value={rule.backgroundRate}
                customInput={TextField}
                onValueChange={handleNumberChange('backgroundRate')}
                decimalScale={0}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NumberFormat
                allowNegative={false}
                label="Priority"
                fullWidth
                value={defaultToEmptyString(rule.priority)}
                customInput={TextField}
                onValueChange={handleNumberChange('priority')}
                decimalScale={0}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Version"
                value={defaultToEmptyString(rule.version)}
                name="version"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Build ID"
                value={defaultToEmptyString(rule.buildID)}
                name="buildID"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Locale"
                value={defaultToEmptyString(rule.locale)}
                name="locale"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Build Target"
                value={defaultToEmptyString(rule.buildTarget)}
                name="buildTarget"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="OS Version"
                value={defaultToEmptyString(rule.osVersion)}
                name="osVersion"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instruction Set"
                value={defaultToEmptyString(rule.instructionSet)}
                name="instructionSet"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Memory"
                value={defaultToEmptyString(rule.memory)}
                name="memory"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Incompatible JAWS Screen Reader"
                select
                value={rule.jaws || EMPTY_MENU_ITEM_CHAR}
                name="jaws"
                onChange={handleInputChange}>
                <MenuItem value={EMPTY_MENU_ITEM_CHAR}>
                  {EMPTY_MENU_ITEM_CHAR}
                </MenuItem>
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Distribution"
                value={defaultToEmptyString(rule.distribution)}
                name="distribution"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Distribution Version"
                value={defaultToEmptyString(rule.distVersion)}
                name="distVersion"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Header Architecture"
                value={defaultToEmptyString(rule.headerArchitecture)}
                name="headerArchitecture"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="64-bit Migration Opt-in"
                select
                value={rule.mig64 || EMPTY_MENU_ITEM_CHAR}
                name="mig64"
                onChange={handleInputChange}>
                <MenuItem value={EMPTY_MENU_ITEM_CHAR}>
                  {EMPTY_MENU_ITEM_CHAR}
                </MenuItem>
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Alias"
                value={defaultToEmptyString(rule.alias)}
                name="alias"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Update Type"
                value={defaultToEmptyString(rule.update_type)}
                name="update_type"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Comment"
                value={defaultToEmptyString(rule.comment)}
                name="comment"
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Fragment>
      )}
      {!isLoading && (
        <Fragment>
          <Tooltip title={isNewRule ? 'Create Rule' : 'Update Rule'}>
            <Fab
              onClick={isNewRule ? handleCreateRule : handleUpdateRule}
              color="primary"
              className={classNames({
                [classes.secondFab]: scheduledChange,
                [classes.fab]: !scheduledChange,
              })}>
              <ContentSaveIcon />
            </Fab>
          </Tooltip>
          {scheduledChange && (
            <SpeedDial ariaLabel="Secondary Actions">
              <SpeedDialAction
                disabled={scheduledChangeAction.loading}
                icon={<DeleteIcon />}
                tooltipOpen
                tooltipTitle="Cancel Pending Change"
                onClick={handleScheduleChangeDelete}
              />
            </SpeedDial>
          )}
        </Fragment>
      )}
    </Dashboard>
  );
}

Rule.propTypes = {
  isNewRule: bool,
};

Rule.defaultProps = {
  isNewRule: false,
};
