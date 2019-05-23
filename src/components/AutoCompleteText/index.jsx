import React from 'react';
import { object, func } from 'prop-types';
import classNames from 'classnames';
import Downshift from 'downshift';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  paperWrapper: {
    position: 'relative',
  },
  selectedText: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

/**
 * A wrapper component around downshift-js to render a material-ui TextField
 * with auto complete capabilities.
 */
function AutoCompleteText({ getSuggestions, textFieldProps, ...props }) {
  const classes = useStyles();

  function renderSuggestion({
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem,
  }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion) > -1;

    return (
      <MenuItem
        {...itemProps}
        key={suggestion}
        selected={isHighlighted}
        component="div"
        className={classNames({ [classes.selectedText]: isSelected })}>
        {suggestion}
      </MenuItem>
    );
  }

  return (
    <Downshift {...props}>
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        highlightedIndex,
        inputValue,
        isOpen,
        selectedItem,
      }) => (
        <div>
          <TextField fullWidth InputProps={getInputProps(textFieldProps)} />
          {getSuggestions && (
            <div className={classes.paperWrapper} {...getMenuProps()}>
              {Boolean(isOpen) && (
                <Paper className={classes.paper} square>
                  {getSuggestions(inputValue).map((suggestion, index) =>
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion }),
                      highlightedIndex,
                      selectedItem,
                    })
                  )}
                </Paper>
              )}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
}

AutoCompleteText.propTypes = {
  getSuggestions: func,
  textFieldProps: object,
};

AutoCompleteText.defaultProps = {
  getSuggestions: null,
  textFieldProps: {},
};

export default AutoCompleteText;
