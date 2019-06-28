import React, { Fragment, useState, useEffect } from 'react';
import { bool } from 'prop-types';
import { defaultTo, assocPath } from 'ramda';
import { addSeconds } from 'date-fns';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/styles';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import ScheduleIcon from 'mdi-react/ScheduleIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import Dashboard from '../../../components/Dashboard';
import AutoCompleteText from '../../../components/AutoCompleteText';
import getSuggestions from '../../../components/AutoCompleteText/getSuggestions';
import DateTimePicker from '../../../components/DateTimePicker';
import useAction from '../../../hooks/useAction';
import {
  getScheduledChange,
  getRule,
  getProducts,
  getChannels,
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
  const [products, fetchProducts] = useAction(getProducts);
  const [channels, fetchChannels] = useAction(getChannels);
  const [releaseNames, fetchReleaseNames] = useAction(getReleaseNames);
  // 30 seconds - to make sure the helper text "Scheduled for ASAP" shows up
  const [scheduleDate, setScheduleDate] = useState(addSeconds(new Date(), -30));
  const [dateTimePickerError, setDateTimePickerError] = useState(null);
  const [{ loading, error }, fetchRule] = useAction(getRule);
  // eslint-disable-next-line no-unused-vars
  const [scheduleChange, fetchScheduledChange] = useAction(getScheduledChange);
  const isLoading =
    loading || scheduleChange.loading || products.loading || channels.loading;
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

  useEffect(() => {
    if (!isNewRule) {
      Promise.all([
        fetchRule(ruleId),
        fetchScheduledChange(ruleId),
        fetchProducts(),
        fetchChannels(),
        fetchReleaseNames(),
      ]).then(
        // Fetching an individual schedule change for a rule throws a 405
        // Example: https://localhost:8010/api/scheduled_changes/rules/195
        // eslint-disable-next-line no-unused-vars
        ([fetchedRuleResponse, fetchedScheduledChangeResponse]) => {
          setRule({
            ...rule,
            ...fetchedRuleResponse.data.data,
          });
        }
      );
    } else {
      Promise.all([fetchProducts(), fetchChannels(), fetchReleaseNames()]);
    }
  }, [ruleId]);

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
                (scheduleDate < new Date() ? 'Scheduled for ASAP' : undefined)
              }
              onDateTimeChange={handleDateTimeChange}
              value={scheduleDate}
            />
          </div>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <AutoCompleteText
                inputValue={defaultToEmptyString(rule.product)}
                onInputValueChange={handleProductChange}
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
                inputValue={defaultToEmptyString(rule.channel)}
                onInputValueChange={handleChannelChange}
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
                inputValue={defaultToEmptyString(rule.mapping)}
                onInputValueChange={handleMappingChange}
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
                inputValue={defaultToEmptyString(rule.fallbackMapping)}
                onInputValueChange={handleFallbackMappingChange}
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
      <Tooltip title={isNewRule ? 'Create Rule' : 'Update Rule'}>
        <Fab color="primary" className={classes.fab}>
          {isNewRule ? <PlusIcon /> : <ScheduleIcon />}
        </Fab>
      </Tooltip>
    </Dashboard>
  );
}

Rule.propTypes = {
  isNewRule: bool,
};

Rule.defaultProps = {
  isNewRule: false,
};
