import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LinkIcon from 'mdi-react/LinkIcon';
import Dashboard from '../../components/Dashboard';
import balrogSrc from '../../images/balrog.svg';

const useStyles = makeStyles({
  balrogImage: {
    width: 800,
    height: 800,
    position: 'fixed',
    zIndex: -1,
    opacity: 0.5,
    transform: 'scaleX(-1)',
  },
  cardPaper: {
    background: 'rgba(255, 255, 255, 0.9)',
  },
});

function Home() {
  const classes = useStyles();

  return (
    <Dashboard title="Home">
      <img alt="Balrog logo" className={classes.balrogImage} src={balrogSrc} />
      <Card className={classes.cardPaper}>
        <CardContent>
          <Typography variant="h5">Rules Common Filters</Typography>
          <List>
            <ListItem button>
              <ListItemText primary="Firefox Release" />
              <LinkIcon />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Fennec Release" />
              <LinkIcon />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Firefox Nightly Release" />
              <LinkIcon />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Fennec Nightly Release" />
              <LinkIcon />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Dashboard>
  );
}

export default Home;
