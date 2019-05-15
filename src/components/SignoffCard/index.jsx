import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { node, string } from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import LinkIcon from 'mdi-react/LinkIcon';
import Link from '../../utils/Link';

const useStyles = makeStyles(theme => ({
  cardHeader: {
    borderBottom: '1px gray dashed',
  },
  cardHeaderAction: {
    alignSelf: 'end',
  },
  linkIcon: {
    marginRight: theme.spacing(1),
  },
}));

function SignoffCard(props) {
  const classes = useStyles();
  const { title, children, to, ...rest } = props;

  return (
    <Card {...rest}>
      <CardActionArea component={Link} to={to}>
        <CardHeader
          classes={{ action: classes.cardHeaderAction }}
          className={classes.cardHeader}
          action={<LinkIcon className={classes.linkIcon} />}
          title={title}
        />
      </CardActionArea>
      {children}
    </Card>
  );
}

SignoffCard.propTypes = {
  /** A title for the signoff card. */
  title: string.isRequired,
  /** A link to navigate when the title is clicked. */
  to: string.isRequired,
  /* The content of the signoff card. */
  children: node.isRequired,
};

export default SignoffCard;
