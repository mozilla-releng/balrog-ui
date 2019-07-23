import { createMuiTheme } from '@material-ui/core/styles';
import { red, blue, deepPurple } from '@material-ui/core/colors';

const SPACING = {
  UNIT: 8,
  DOUBLE: 16,
  TRIPLE: 24,
  QUAD: 32,
};

export default createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: blue,
    error: red,
  },
  typography: {
    useNextVariants: true,
  },
  mixins: {
    link: {
      textDecoration: 'none',
      color: 'unset',
    },
    fab: {
      position: 'fixed',
      bottom: SPACING.DOUBLE,
      right: SPACING.TRIPLE,
    },
    textEllipsis: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  overrides: {
    MuiListItem: {
      dense: {
        paddingTop: SPACING.UNIT / 2,
        paddingBottom: SPACING.UNIT / 2,
      },
    },
  },
});
