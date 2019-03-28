import React, { useState } from 'react';
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
    marginTop: theme.spacing(2),
  },
}));

export default function HistoryForm(props) {
  const { onSubmit } = props;
  const classes = useStyles();
  const [object, setObject] = useState('');
  const [changedBy, setChangedBy] = useState('');
  const [dateTimeStart, setDateTimeStart] = useState('');
  const [dateTimeEnd, setDateTimeEnd] = useState('');
  const objectOptions = [
    'rules',
    'releases',
    'permissions',
    'required_signoffs/product',
    'required_signoffs/permissions',
  ];

  function handleFormSubmit(e) {
    e.preventDefault();

    onSubmit({
      object,
      changedBy,
      dateTimeStart,
      dateTimeEnd,
    });
  }

  function handleObjectChange({ target }) {
    setObject(target.value);
  }

  function handleChangedByChange({ target }) {
    setChangedBy(target.value);
  }

  function handleDateTimeStartChange(date) {
    setDateTimeStart(date);
  }

  function handleDateTimeEndChange(date) {
    setDateTimeEnd(date);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <List>
        <ListItem>
          <TextField
            required
            select
            fullWidth
            label="Objects"
            value={object}
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
          <DateTimePicker onDateTimeChange={handleDateTimeStartChange} />
        </ListItem>
        <ListSubheader>Date End</ListSubheader>
        <ListItem>
          <DateTimePicker onDateTimeChange={handleDateTimeEndChange} />
        </ListItem>
        <ListItem className={classes.searchListItem}>
          <Button className={classes.search} variant="contained" type="submit">
            Search
          </Button>
        </ListItem>
      </List>
    </form>
  );
}

HistoryForm.propTypes = {
  onSubmit: func.isRequired,
};
