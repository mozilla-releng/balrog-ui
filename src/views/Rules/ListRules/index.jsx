import React, { Fragment, useEffect, useState, useMemo } from 'react';
import { stringify, parse } from 'qs';
import { addSeconds } from 'date-fns';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { makeStyles, useTheme } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import PlusIcon from 'mdi-react/PlusIcon';
import Dashboard from '../../../components/Dashboard';
import ErrorPanel from '../../../components/ErrorPanel';
import RuleCard from '../../../components/RuleCard';
import DialogAction from '../../../components/DialogAction';
import DateTimePicker from '../../../components/DateTimePicker';
import VariableSizeList from '../../../components/VariableSizeList';
import DiffRule from '../../../components/DiffRule';
import Link from '../../../utils/Link';
import getDiffedProperties from '../../../utils/getDiffedProperties';
import useAction from '../../../hooks/useAction';
import {
  getProducts,
  getChannels,
  getRules,
  getScheduledChanges,
  getScheduledChangeByRuleId,
  deleteRule,
} from '../../../services/rules';
import { getRequiredSignoffs } from '../../../services/requiredSignoffs';
import { ruleMatchesRequiredSignoff } from '../../../utils/requiredSignoffs';
import {
  RULE_DIFF_PROPERTIES,
  DIALOG_ACTION_INITIAL_STATE,
  OBJECT_NAMES,
  SNACKBAR_INITIAL_STATE,
} from '../../../utils/constants';
import remToPx from '../../../utils/remToPx';
import elementsHeight from '../../../utils/elementsHeight';
import Snackbar from '../../../components/Snackbar';

const ALL = 'all';
const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
  },
  options: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  dropdown: {
    minWidth: 200,
    marginBottom: theme.spacing(2),
  },
  tablePaginationToolbar: {
    paddingLeft: 'unset',
  },
  tablePaginationSpacer: {
    flex: 'unset',
  },
  ruleCard: {
    margin: theme.spacing(1),
  },
}));

function ListRules(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { search, hash } = props.location;
  const query = parse(search.slice(1));
  const hashQuery = parse(hash.replace('#', ''));
  const {
    body1TextHeight,
    body2TextHeight,
    subtitle1TextHeight,
    buttonHeight,
  } = elementsHeight(theme);
  const productChannelSeparator = ' : ';
  const [snackbarState, setSnackbarState] = useState(SNACKBAR_INITIAL_STATE);
  const [ruleIdHash, setRuleIdHash] = useState(null);
  const [scheduledIdHash, setScheduledIdHash] = useState(null);
  const [rulesWithScheduledChanges, setRulesWithScheduledChanges] = useState(
    []
  );
  const [rewoundRules, setRewoundRules] = useState(
    []
  );
  const [productChannelOptions, setProductChannelOptions] = useState([]);
  const searchQueries = query.product ? [query.product, query.channel] : null;
  const [productChannelFilter, setProductChannelFilter] = useState(
    searchQueries
      ? searchQueries.filter(Boolean).join(productChannelSeparator)
      : ALL
  );
  const [dialogState, setDialogState] = useState(DIALOG_ACTION_INITIAL_STATE);
  const [scheduleDeleteDate, setScheduleDeleteDate] = useState(
    addSeconds(new Date(), -30)
  );
  const [dateTimePickerError, setDateTimePickerError] = useState(null);
  const [rewindDate, setRewindDate] = useState(null);
  const [rewindDateError, setRewindDateError] = useState(null);
  const [scrollToRow, setScrollToRow] = useState(null);
  const [products, fetchProducts] = useAction(getProducts);
  const [channels, fetchChannels] = useAction(getChannels);
  const [rules, fetchRules] = useAction(getRules);
  const [scheduledChanges, fetchScheduledChanges] = useAction(
    getScheduledChanges
  );
  const [requiredSignoffs, fetchRequiredSignoffs] = useAction(
    getRequiredSignoffs
  );
  const delRule = useAction(deleteRule)[1];
  const isLoading = products.loading || channels.loading || rules.loading;
  const error =
    products.error || channels.error || rules.error || scheduledChanges.error;
  const handleFilterChange = ({ target: { value } }) => {
    const [product, channel] = value.split(productChannelSeparator);
    const query =
      value !== ALL
        ? stringify({ product, channel }, { addQueryPrefix: true })
        : '';

    props.history.push(`/rules${query}`);

    setProductChannelFilter(value);
  };

  const handleSnackbarOpen = ({ message, variant = 'success' }) => {
    setSnackbarState({ message, variant, open: true });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarState(SNACKBAR_INITIAL_STATE);
  };

  const pairExists = (product, channel) =>
    rules.data &&
    rules.data.data.rules.some(
      rule => rule.product === product && rule.channel === channel
    );

  useEffect(() => {
    if (!products.data || !channels.data || !rules.data) {
      return;
    }

    const prods = products.data.data.product;
    const chs = channels.data.data.channel;
    const options = [];

    prods.forEach(product => {
      options.push(product);

      chs.forEach(channel => {
        if (!channel.endsWith('*') && pairExists(product, channel)) {
          options.push(`${product}${productChannelSeparator}${channel}`);
        }
      });
    });

    setProductChannelOptions(options.sort());
  }, [products.data, channels.data, rules.data]);

  useEffect(() => {
    if (!rules.data || !scheduledChanges.data || !requiredSignoffs.data) {
      return;
    }

    if (rewindDate) {
      setRewoundRules(rules.data.data.rules);
    } else {
      const rulesWithScheduledChanges = rules.data.data.rules.map(rule => {
        const sc = scheduledChanges.data.data.scheduled_changes.find(
          sc => rule.rule_id === sc.rule_id
        );
        const returnedRule = Object.assign({}, rule);

        if (sc) {
          returnedRule.scheduledChange = sc;
          returnedRule.scheduledChange.when = new Date(
            returnedRule.scheduledChange.when
          );
        }

        returnedRule.requiredSignoffs = {};
        requiredSignoffs.data.data.required_signoffs.forEach(rs => {
          if (ruleMatchesRequiredSignoff(rule, rs)) {
            returnedRule.requiredSignoffs[rs.role] = rs.signoffs_required;
          }
        });

        return returnedRule;
      });

      scheduledChanges.data.data.scheduled_changes.forEach(sc => {
        if (sc.change_type === 'insert') {
          const rule = { scheduledChange: sc };

          Object.assign(rule, { scheduledChange: sc });
          Object.assign(rule.scheduledChange, {
            when: new Date(rule.scheduledChange.when),
          });

          rulesWithScheduledChanges.push(rule);
        }
      });

      // Rules are sorted by priority. Rules that are
      // pending (ie: still just a Scheduled Change) will be inserted based
      // on the priority in the Scheduled Change. Rules that have Scheduled
      // updates or deletes will remain sorted on their current priority
      // because it's more important to make it easy to assess current state
      // than future state.
      const sortedRules = rulesWithScheduledChanges.sort((ruleA, ruleB) => {
        const priorityA =
          ruleA.priority === null || ruleA.priority === undefined
            ? ruleA.scheduledChange.priority
            : ruleA.priority;
        const priorityB =
          ruleB.priority === null || ruleB.priority === undefined
            ? ruleB.scheduledChange.priority
            : ruleB.priority;

        return priorityB - priorityA;
      });

      setRulesWithScheduledChanges(sortedRules);
      setRewoundRules([]);
    }
  }, [rules, scheduledChanges, requiredSignoffs]);

  useEffect(() => {
    fetchRules(rewindDate ? rewindDate.getTime() : null);
  }, [rewindDate]);

  useEffect(() => {
    Promise.all([
      fetchScheduledChanges(),
      fetchRules(),
      fetchRequiredSignoffs(OBJECT_NAMES.PRODUCT_REQUIRED_SIGNOFF),
      fetchProducts(),
      fetchChannels(),
    ]);
  }, []);
  const filteredRulesWithScheduledChanges = useMemo(
    () => {
      // should be rulesWithScheduledChanges if rewoundRules.length is 0, or we're diffing
      // rewound rules against current rules
      // TODO: make this work without hardcodes :)
      // use this line for non-diff mode
      //const rulesToShow = rewoundRules.length === 0 ? rulesWithScheduledChanges : rewoundRules;
      // use this line for diff mode
      const rulesToShow = rulesWithScheduledChanges;
      return productChannelFilter === ALL
        ? rulesToShow
        : rulesToShow.filter(rule => {
            const [productFilter, channelFilter] = searchQueries;
            const ruleProduct =
              rule.product ||
              (rule.scheduledChange && rule.scheduledChange.product);
            const ruleChannel =
              rule.channel ||
              (rule.scheduledChange && rule.scheduledChange.channel);

            if (ruleProduct !== productFilter) {
              return false;
            }

            if (
              channelFilter &&
              ruleChannel.replace('*', '') !== channelFilter
            ) {
              return false;
            }

            return true;
          });
    },
    [productChannelFilter, rulesWithScheduledChanges, rewoundRules]
  );
  const handleDateTimePickerError = error => {
    setDateTimePickerError(error);
  };

  const handleDateTimeChange = date => {
    setScheduleDeleteDate(date);
    setDateTimePickerError(null);
  };

  const handleRewindDateTimePickerError = error => setRewindDateError(error);
  const handleRewindDateTimeChange = date => {
    setRewindDate(date);
    setRewindDateError(null);
  };

  const handleDialogError = error => {
    setDialogState({ ...dialogState, error });
  };

  const dialogBody =
    dialogState.item &&
    (Object.keys(dialogState.item.requiredSignoffs).length > 0 ? (
      <DateTimePicker
        disablePast
        inputVariant="outlined"
        fullWidth
        label="When"
        onError={handleDateTimePickerError}
        helperText={
          dateTimePickerError ||
          (scheduleDeleteDate < new Date() ? 'Scheduled for ASAP' : undefined)
        }
        onDateTimeChange={handleDateTimeChange}
        value={scheduleDeleteDate}
      />
    ) : (
      `This will delete rule ${dialogState.item.rule_id}.`
    ));
  const filteredRulesCount = filteredRulesWithScheduledChanges.length;
  const handleRuleDelete = rule => {
    setDialogState({
      ...dialogState,
      open: true,
      title: 'Delete Rule?',
      confirmText: 'Delete',
      destructive: true,
      item: rule,
    });
  };

  const handleDialogClose = () => {
    setDialogState(DIALOG_ACTION_INITIAL_STATE);
  };

  const handleDialogComplete = result => {
    if (typeof result === 'number') {
      // The rule was directly deleted, just remove it.
      setRulesWithScheduledChanges(
        rulesWithScheduledChanges.filter(i => i.rule_id !== result)
      );
      handleSnackbarOpen({
        message: `Rule ${result} deleted`,
      });
    } else {
      // A change was scheduled, we need to update the card
      // to reflect that.
      setRulesWithScheduledChanges(
        rulesWithScheduledChanges.map(r => {
          if (r.rule_id !== result.rule_id) {
            return r;
          }

          const newRule = { ...r };

          newRule.scheduledChange = result;

          return newRule;
        })
      );
      handleSnackbarOpen({
        message: `Rule ${result.rule_id} successfully scheduled`,
      });
    }

    handleDialogClose();
  };

  const handleDialogSubmit = async () => {
    const dialogRule = dialogState.item;
    const { error } = await delRule({
      ruleId: dialogRule.rule_id,
      dataVersion: dialogRule.data_version,
    });

    if (error) {
      throw error;
    }

    if (Object.keys(dialogRule.requiredSignoffs).length > 0) {
      return (await getScheduledChangeByRuleId(dialogRule.rule_id)).data
        .scheduled_changes[0];
    }

    return dialogRule.rule_id;
  };

  const getRowHeight = ({ index }) => {
    const rule = filteredRulesWithScheduledChanges[index];
    const hasScheduledChanges = Boolean(rule.scheduledChange);
    // Padding top and bottom included
    const listPadding = theme.spacing(1);
    const listItemTextMargin = 6;
    const diffRowHeight = remToPx(theme.typography.body2.fontSize) * 1.5;
    // <CardContent /> padding
    let height = theme.spacing(2);

    // actions row
    height += buttonHeight + theme.spacing(2);

    if (!hasScheduledChanges || rule.scheduledChange.change_type !== 'insert') {
      // avatar height (title) + padding
      height += theme.spacing(4) + theme.spacing(3);

      // != checks for both null and undefined
      const keys = Object.keys(rule).filter(key => rule[key] != null);
      const firstColumn = ['mapping', 'fallbackMapping', 'backgroundRate'];
      const secondColumn = ['data_version', 'rule_id'];
      const thirdColumn = [
        'version',
        'buildID',
        'buildTarget',
        'locale',
        'distribution',
        'distVersion',
        'osVersion',
        'instructionSet',
        'memory',
        'headerArchitecture',
        'mig64',
        'jaws',
      ];
      // card rows
      const rows = Math.max(
        keys.filter(key => firstColumn.includes(key)).length,
        keys.filter(key => secondColumn.includes(key)).length,
        keys.filter(key => thirdColumn.includes(key)).length
      );

      height +=
        rows *
          (body1TextHeight() + body2TextHeight() + 2 * listItemTextMargin) +
        2 * listPadding;

      // row with comment
      // (max 8*10px; ~3 lines of comments otherwise we display a scroller)
      if (rule.comment) {
        height += theme.spacing(10) + 2 * listItemTextMargin + 2 * listPadding;
      }
    }

    if (hasScheduledChanges) {
      // row with the chip label
      height += subtitle1TextHeight();

      if (rule.scheduledChange.change_type === 'delete') {
        // row with "all properties will be deleted" + padding
        height += body2TextHeight() + theme.spacing(2);
      } else if (
        rule.scheduledChange.change_type === 'update' ||
        rule.scheduledChange.change_type === 'insert'
      ) {
        const diffedProperties = getDiffedProperties(
          RULE_DIFF_PROPERTIES,
          rule,
          rule.scheduledChange
        );

        // diff viewer + marginTop
        height += diffedProperties.length * diffRowHeight + theme.spacing(1);
      }

      if (
        rule.scheduledChange.change_type === 'delete' ||
        rule.scheduledChange.change_type === 'update'
      ) {
        // divider
        height += theme.spacing(2) + 1;

        if (Object.keys(rule.scheduledChange.required_signoffs).length > 0) {
          const requiredRoles = Object.keys(
            rule.scheduledChange.required_signoffs
          ).length;
          const nSignoffs = Object.keys(rule.scheduledChange.signoffs).length;
          // Required Roles and Signoffs are beside one another, so we only
          // need to account for the one with the most items.
          const signoffRows = Math.max(requiredRoles, nSignoffs);

          // Padding above the summary
          height += theme.spacing(2);

          // The "Requires Signoff From" title and the margin beneath it
          height += body2TextHeight() + theme.spacing(0.5);

          // Space for however many rows exist.
          height += signoffRows * body2TextHeight();
        }
      }
    }

    // space below the card (margin)
    height += theme.spacing(6);

    return height;
  };

  const Row = ({ index, style }) => {
    // if we're in rewind mode, rule is a historical rule, not the current one
    const rule = filteredRulesWithScheduledChanges[index];

    // this is always the current version
    const currentRule = rulesWithScheduledChanges.filter(r => r.rule_id == rule.rule_id);

    return (
      <div
        key={
          rule.rule_id
            ? rule.rule_id
            : Object.values(rule.scheduledChange).join('-')
        }
        style={style}>
        {/* should we go read only mode if rewindDAte is set instead? */}
        {rewoundRules === 0 ? (
        <RuleCard
          className={classes.ruleCard}
          key={rule.rule_id}
          rule={rule}
          onRuleDelete={handleRuleDelete}
          disableActions={!!rewindDate}
        />
        ) : (
        {/* todo: why is the current version of the rule showing up on the left side? */}
        <DiffRule firstRule={rule} secondRule={currentRule} />
        )}
      </div>
    );
  };

  useEffect(() => {
    if (filteredRulesCount) {
      if (hashQuery.ruleId && hashQuery.ruleId !== ruleIdHash) {
        const ruleId = Number(hashQuery.ruleId);

        if (ruleId) {
          const itemNumber = filteredRulesWithScheduledChanges
            .map(rule => rule.rule_id)
            .indexOf(ruleId);

          setScrollToRow(itemNumber);
          setRuleIdHash(hashQuery.ruleId);
        }
      } else if (hashQuery.scId && hashQuery.scId !== scheduledIdHash) {
        const scId = Number(hashQuery.scId);

        if (scId) {
          const itemNumber = filteredRulesWithScheduledChanges
            .map(rule => rule.scheduledChange && rule.scheduledChange.sc_id)
            .indexOf(scId);

          setScrollToRow(itemNumber);
          setScheduledIdHash(hashQuery.scId);
        }
      }
    }
  }, [hashQuery, filteredRulesCount]);

  return (
    <Dashboard title="Rules">
      {isLoading && <Spinner loading />}
      {error && <ErrorPanel fixed error={error} />}
      {!isLoading && productChannelOptions && (
        <Fragment>
          <div className={classes.options}>
            <DateTimePicker
              disableFuture
              inputVariant="outlined"
              label="Rewind to..."
              onError={handleRewindDateTimePickerError}
              helperText={rewindDateError}
              onDateTimeChange={handleRewindDateTimeChange}
              value={rewindDate}
            />
            <FormControl>
              <FormLabel>Diff?</FormLabel>
              <Checkbox disabled={!rewindDate} />
            </FormControl>

            <TextField
              className={classes.dropdown}
              select
              label={`Product${productChannelSeparator}Channel`}
              value={productChannelFilter}
              onChange={handleFilterChange}>
              <MenuItem value="all">All Rules</MenuItem>
              {productChannelOptions.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
          {filteredRulesWithScheduledChanges && (
            <Fragment>
              <VariableSizeList
                rowRenderer={Row}
                scrollToRow={scrollToRow}
                rowHeight={getRowHeight}
                rowCount={filteredRulesCount}
              />
            </Fragment>
          )}
          <Link to="/rules/create">
            <Tooltip title="Add Rule">
              <Fab color="primary" className={classes.fab}>
                <PlusIcon />
              </Fab>
            </Tooltip>
          </Link>
        </Fragment>
      )}
      <DialogAction
        open={dialogState.open}
        title={dialogState.title}
        destructive={dialogState.destructive}
        body={dialogBody}
        confirmText={dialogState.confirmText}
        onSubmit={handleDialogSubmit}
        onError={handleDialogError}
        error={dialogState.error}
        onComplete={handleDialogComplete}
        onClose={handleDialogClose}
      />
      <Snackbar onClose={handleSnackbarClose} {...snackbarState} />
    </Dashboard>
  );
}

export default ListRules;
