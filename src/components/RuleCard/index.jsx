import React, { Fragment, useState, useEffect } from 'react';
import classNames from 'classnames';
import { title } from 'change-case';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from 'mdi-react/DeleteIcon';
import UpdateIcon from 'mdi-react/UpdateIcon';
import PlusCircleIcon from 'mdi-react/PlusCircleIcon';
import HistoryIcon from 'mdi-react/HistoryIcon';
import { diffLines, formatLines } from 'unidiff';
import { parseDiff, Diff, Hunk } from 'react-diff-view';
import { distanceInWordsStrict } from 'date-fns';
import 'react-diff-view/style/index.css';
import { RULE_DIFF_PROPERTIES } from '../../utils/constants';
import { rule } from '../../utils/prop-types';

const useStyles = makeStyles(theme => ({
  cardHeader: {
    paddingBottom: 0,
  },
  cardContentRoot: {
    padding: theme.spacing(1),
  },
  deletedText: {
    padding: theme.spacing(1),
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  textEllipsis: {
    ...theme.mixins.textEllipsis,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  scheduledChangesTitle: {
    padding: `0 ${theme.spacing(1)}px`,
  },
  diff: {
    fontSize: theme.typography.body2.fontSize,
    marginTop: theme.spacing(1),
  },
  chip: {
    height: theme.spacing(3),
  },
  chipIcon: {
    marginLeft: theme.spacing(1),
    marginBottom: 1,
  },
  deleteChip: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '& svg': {
      fill: theme.palette.error.contrastText,
    },
  },
  divider: {
    margin: `${theme.spacing(1)}px`,
  },
  scheduledChangesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

function RuleCard({ rule, ...props }) {
  const classes = useStyles();
  const [{ type, hunks }, setDiff] = useState('');
  const getChipIcon = changeType => {
    switch (changeType) {
      case 'delete': {
        return DeleteIcon;
      }

      case 'update': {
        return UpdateIcon;
      }

      case 'insert': {
        return PlusCircleIcon;
      }

      default: {
        return PlusCircleIcon;
      }
    }
  };

  const ChipIcon = getChipIcon(
    rule.scheduledChange && rule.scheduledChange.change_type
  );
  const propDiff = prop => {
    const prev = rule[prop];
    const next = rule.scheduledChange[prop];

    // == checks for both undefined or null
    // eslint-disable-next-line eqeqeq
    if (prev == next) {
      return null;
    }

    return {
      prev: `${title(prop)}: ${prev}`,
      next: `${title(prop)}: ${next}`,
    };
  };

  const getDiffText = () => {
    const prevValues = [];
    const nextValues = [];

    RULE_DIFF_PROPERTIES.map(prop => propDiff(prop))
      .filter(Boolean)
      .forEach(({ prev, next }) => {
        prevValues.push(prev);
        nextValues.push(next);
      });

    return [prevValues.join('\n'), nextValues.join('\n')];
  };

  useEffect(() => {
    if (!rule.scheduledChange) {
      return;
    }

    const [oldText, newText] = getDiffText();
    const diffText = formatLines(diffLines(oldText, newText), {
      context: 0,
    });
    const [diff] = parseDiff(diffText, { nearbySequences: 'zip' });

    setDiff(diff);
  }, [rule]);

  return (
    <Card spacing={4} {...props}>
      {rule.product && (
        <CardHeader
          className={classes.cardHeader}
          title={`${rule.product} : ${rule.channel}`}
          action={
            <Tooltip title="History">
              <IconButton>
                <HistoryIcon />
              </IconButton>
            </Tooltip>
          }
        />
      )}
      <CardContent classes={{ root: classes.cardContentRoot }}>
        <Grid container>
          <Grid item xs={4}>
            <List>
              {rule.mapping && (
                <ListItem className={classes.listItem}>
                  <ListItemText
                    secondaryTypographyProps={{
                      className: classes.textEllipsis,
                    }}
                    primary="Mapping"
                    secondary={rule.mapping}
                  />
                </ListItem>
              )}
              {rule.data_version && (
                <ListItem className={classes.listItem}>
                  <ListItemText
                    primary="Data Version"
                    secondary={rule.data_version}
                  />
                </ListItem>
              )}
              {Number.isInteger(Number(rule.rule_id)) && (
                <ListItem className={classes.listItem}>
                  <ListItemText primary="Rule ID" secondary={rule.rule_id} />
                </ListItem>
              )}
            </List>
          </Grid>
          <Grid item xs={4}>
            <List>
              {Number.isInteger(Number(rule.backgroundRate)) && (
                <ListItem className={classes.listItem}>
                  <ListItemText
                    primary="Background Rate"
                    secondary={rule.backgroundRate}
                  />
                </ListItem>
              )}
              {Number.isInteger(Number(rule.priority)) && (
                <ListItem className={classes.listItem}>
                  <ListItemText primary="Priority" secondary={rule.priority} />
                </ListItem>
              )}
            </List>
          </Grid>
          <Grid item xs={4}>
            <List>
              {rule.version && (
                <ListItem className={classes.listItem}>
                  <ListItemText primary="Version" secondary={rule.version} />
                </ListItem>
              )}
              {rule.distribution && (
                <ListItem className={classes.listItem}>
                  <ListItemText
                    primary="Distribution"
                    secondary={rule.distribution}
                  />
                </ListItem>
              )}
              {rule.update_type && (
                <ListItem className={classes.listItem}>
                  <ListItemText
                    primary="Update Type"
                    secondary={rule.update_type}
                  />
                </ListItem>
              )}
            </List>
          </Grid>
        </Grid>
        {rule.comment && (
          <List>
            <ListItem className={classes.listItem}>
              <ListItemText primary="Comment" secondary={rule.comment} />
            </ListItem>
          </List>
        )}
        {rule.scheduledChange && (
          <Fragment>
            {rule.scheduledChange.change_type !== 'insert' && (
              <Divider className={classes.divider} />
            )}
            <div className={classes.scheduledChangesHeader}>
              <Typography
                className={classes.scheduledChangesTitle}
                variant="h6">
                Scheduled Changes
              </Typography>
              <Chip
                className={classNames(classes.chip, {
                  [classes.deleteChip]:
                    rule.scheduledChange.change_type === 'delete',
                })}
                icon={<ChipIcon className={classes.chipIcon} size={16} />}
                label={`${distanceInWordsStrict(
                  new Date(),
                  rule.scheduledChange.when,
                  { addSuffix: true }
                )} (${rule.scheduledChange.change_type})`}
              />
            </div>
            {rule.scheduledChange.change_type === 'delete' ? (
              <Typography
                className={classes.deletedText}
                variant="body2"
                color="textSecondary">
                All properties will be deleted
              </Typography>
            ) : (
              type && (
                <Diff
                  className={classes.diff}
                  viewType="split"
                  diffType={type}
                  hunks={hunks || []}>
                  {hunks =>
                    hunks.map(hunk => <Hunk key={hunk.content} hunk={hunk} />)
                  }
                </Diff>
              )
            )}
          </Fragment>
        )}
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button color="secondary">Duplicate</Button>
        <Button color="secondary">Update</Button>
        <Button color="secondary">Delete</Button>
      </CardActions>
    </Card>
  );
}

RuleCard.propTypes = {
  rule,
};

export default RuleCard;
