import React, { useState, useEffect } from 'react';
import PlusIcon from 'mdi-react/PlusIcon';
import { makeStyles, useTheme } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import Dashboard from '../../../components/Dashboard';
import ReleaseCard from '../../../components/ReleaseCard';
import useAction from '../../../hooks/useAction';
import Link from '../../../utils/Link';
import { getReleases } from '../../../services/releases';
import VariableSizeList from '../../../components/VariableSizeList';

const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
  },
}));

function ListPermissions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { hash } = props.location;
  const [releaseNameHash, setReleaseNameHash] = useState(null);
  const [scrollToItem, setScrollToItem] = useState(null);
  const [releases, fetchReleases] = useAction(getReleases);
  const isLoading = releases.loading;

  useEffect(() => {
    fetchReleases();
  }, []);

  useEffect(() => {
    if (hash !== releaseNameHash && releases.data) {
      const name = hash.replace('#', '') || null;

      if (name) {
        const itemNumber = releases.data.data.releases
          .map(release => release.name)
          .indexOf(name);

        setScrollToItem(itemNumber);
        setReleaseNameHash(hash);
      }
    }
  }, [hash, releases.data]);

  const Row = ({ index, style }) => {
    const release = releases.data.data.releases[index];

    return (
      <div style={style}>
        <ReleaseCard release={release} />
      </div>
    );
  };

  // We need to handle item keys since the list
  // can be modified (e.g., deleting a release)
  const itemKey = index => {
    const item = releases.data.data.releases[index];

    return item.name;
  };

  const getItemSize = index => {
    const release = releases.data.data.releases[index];
    // An approximation
    const ruleIdsLineCount = Math.ceil(release.rule_ids.length / 10) || 1;
    // card header
    let height = theme.spacing(9);

    // first row
    height += theme.spacing(7);
    // rule ids row
    height += theme.spacing(3) + ruleIdsLineCount * theme.spacing(3);
    // actions row
    height += 7 * theme.spacing(1);
    // space below the card (margin)
    height += theme.spacing(6);

    return height;
  };

  return (
    <Dashboard title="Releases">
      {isLoading && <Spinner loading />}
      {!isLoading && releases.data && (
        <VariableSizeList
          itemKey={itemKey}
          itemSize={getItemSize}
          scrollToItem={scrollToItem}
          itemCount={releases.data.data.releases.length}>
          {Row}
        </VariableSizeList>
      )}
      {!isLoading && (
        <Link to="/releases/create">
          <Tooltip title="Add Release">
            <Fab color="primary" className={classes.fab}>
              <PlusIcon />
            </Fab>
          </Tooltip>
        </Link>
      )}
    </Dashboard>
  );
}

export default ListPermissions;
