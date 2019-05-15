import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from 'mdi-react/DeleteIcon';
import ContentSaveIcon from 'mdi-react/ContentSaveIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import Dashboard from '../../../components/Dashboard';
import { getProducts } from '../../../utils/Rules';
import tryCatch from '../../../utils/tryCatch';

const useStyles = makeStyles(theme => ({
  iconButtonGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
    marginTop: theme.spacing(1),
  },
  fab: {
    ...theme.mixins.fab,
  },
  gridWithIcon: {
    marginTop: theme.spacing(3),
  },
}));

export default function ViewSignoff() {
  const classes = useStyles();
  const [products, setProducts] = useState();
  const [type, setType] = useState('channel');
  const handleTypeChange = ({ target: { value } }) => setType(value);

  console.log(products);
  console.log(setProducts);
  useEffect(() => {
    console.log('prior to getting products');

    (async () => {
      const [error, result] = await tryCatch(getProducts());

      console.log(error);
      console.log('products: ', result);
      // setProducts(result);
    })();
  }, []);

  return (
    <Dashboard>
      <form autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField autoFocus fullWidth label="Product" required />
          </Grid>
          <Grid item xs={12}>
            <FormControl margin="normal" component="fieldset">
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup
                aria-label="Channel"
                name="channel"
                value={type}
                onChange={handleTypeChange}>
                <FormControlLabel
                  value="channel"
                  control={<Radio />}
                  label="Channel"
                />
                <FormControlLabel
                  value="permission"
                  control={<Radio />}
                  label="Permission"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          {type === 'channel' && (
            <Grid item xs={12}>
              <TextField fullWidth label="Channel" />
            </Grid>
          )}
        </Grid>
        <Grid className={classes.gridWithIcon} container spacing={2}>
          <Grid item xs>
            <TextField fullWidth label="Role" />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              label="Signoffs Required"
              type="number"
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid className={classes.iconButtonGrid} item xs={1}>
            <IconButton className={classes.iconButton}>
              <PlusIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <List>
              <ListItem disableGutters divider dense>
                <ListItemText primary="test" secondary="2 signoffs required" />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </form>
      <Fab color="primary" className={classes.fab}>
        <ContentSaveIcon />
      </Fab>
    </Dashboard>
  );
}
