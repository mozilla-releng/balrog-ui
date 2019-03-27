import React, { Fragment, useState } from 'react';
import { func } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import DateTimePicker from '../DateTimePicker';

const useStyles = makeStyles(theme => ({
  searchListItem: {
    display: 'flex',
    flexFlow: 'row-reverse',
  },
  search: {
    marginTop: theme.spacing.unit * 2,
  },
}));

export default function HistoryForm() {
  const classes = useStyles();
  const [objects, setObjects] = useState('');
  const [changedBy, setChangedBy] = useState('');
  const objectOptions = [
    'rules',
    'releases',
    'permissions',
    'required_signoffs/product',
    'required_signoffs/permissions',
  ];

  function handleObjectChange({ target }) {
    setObjects(target.value);
  }

  function handleChangedByChange({ target }) {
    setChangedBy(target.value);
  }

  return (
    <Fragment>
      <List>
        <ListItem>
          <TextField
            required
            select
            fullWidth
            label="Objects"
            value={objects}
            onChange={handleObjectChange}>
            {objectOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </ListItem>
        <ListItem>
          <TextField
            fullWidth
            label="Changed By"
            value={changedBy}
            onChange={handleChangedByChange}>
            {changedBy}
          </TextField>
        </ListItem>
        <ListSubheader>Date Start</ListSubheader>
        <ListItem>
          <DateTimePicker onDateTimeChange={() => {}} />
        </ListItem>
        <ListSubheader>Date End</ListSubheader>
        <ListItem>
          <DateTimePicker onDateTimeChange={() => {}} />
        </ListItem>
        <ListItem className={classes.searchListItem}>
          <Button className={classes.search} variant="contained">
            Search
          </Button>
        </ListItem>
      </List>
    </Fragment>
  );
}

HistoryForm.propTypes = {
  onSubmit: func.isRequired,
};
