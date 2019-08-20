import React, { Fragment, useState, useEffect } from 'react';
import classNames from 'classnames';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import ContentSaveIcon from 'mdi-react/ContentSaveIcon';
import DeleteIcon from 'mdi-react/DeleteIcon';
import Dashboard from '../../../components/Dashboard';
import ErrorPanel from '../../../components/ErrorPanel';
import SpeedDial from '../../../components/SpeedDial';
import AutoCompleteText from '../../../components/AutoCompleteText';
import CodeEditor from '../../../components/CodeEditor';
import useAction from '../../../hooks/useAction';
import { getReleases, getRelease, createRelease, deleteRelease, addScheduledChange, updateScheduledChange, getScheduledChangeByName, getScheduledChangeByScId } from '../../../services/releases';
import { getProducts } from '../../../services/rules';
import getSuggestions from '../../../components/AutoCompleteText/getSuggestions';

const useStyles = makeStyles(theme => ({
  fab: {
    ...theme.mixins.fab,
  },
  secondFab: {
    ...theme.mixins.fab,
    right: theme.spacing(12),
  },
  // Ensure fab  has higher priority than the code editor.
  // Otherwise, the fab is not clickable.
  saveButton: {
    zIndex: 10,
  },
}));

export default function Release(props) {
  const classes = useStyles();
  const {
    isNewRelease,
    match: {
      params: { releaseName },
    },
  } = props;
  const [releaseNameValue, setReleaseNameValue] = useState(releaseName || '');
  const [productTextValue, setProductTextValue] = useState('');
  const [releaseEditorValue, setReleaseEditorValue] = useState('{}');
  const [scId, setScId] = useState(null);
  const [dataVersion, setDataVersion] = useState(null);
  const [scDataVersion, setScDataVersion] = useState(null);
  const [hasRules, setHasRules] = useState(false);
  const [release, fetchRelease] = useAction(getRelease);
  const [createRelAction, createRel] = useAction(createRelease);
  const [delReleaseAction, delRelease] = useAction(deleteRelease);
  const [addSCAction, addSC] = useAction(addScheduledChange);
  const [updateSCAction, updateSC] = useAction(updateScheduledChange);
  const [scheduledChangeActionName, fetchScheduledChangeByName] = useAction(
    getScheduledChangeByName
  );
  const [scheduledChangeActionScId, fetchScheduledChangeByScId] = useAction(
    getScheduledChangeByScId
  );
  const fetchReleases = useAction(getReleases)[1];
  const [products, fetchProducts] = useAction(getProducts);
  const isLoading = release.loading || products.loading || scheduledChangeActionName.loading || scheduledChangeActionScId.loading;
  // TODO: Fill actionLoading when hooking up mutations
  const actionLoading = createRelAction.loading || delReleaseAction.loading || addSCAction.loading || updateSCAction.loading;
  const error = release.error || products.error || createRelAction.error || delReleaseAction.error || addSCAction.error || updateSCAction.error || scheduledChangeActionName.error || scheduledChangeActionScId.error;

  useEffect(() => {
    if (releaseName) {
      Promise.all([
        fetchRelease(releaseName),
        fetchScheduledChangeByName(releaseName),
        fetchReleases(),
      ]).then(
        ([fetchedRelease, fetchedSC, fetchedReleases]) => {
          if (fetchedSC.data.data.count > 0) {
            const sc = fetchedSC.data.data.scheduled_changes[0];
            setReleaseEditorValue(
              JSON.stringify(sc.data, null, 2)
            );
            setProductTextValue(sc.product);
            setDataVersion(sc.data_version);
            setScId(sc.sc_id);
            setScDataVersion(sc.sc_data_version);
            if (sc.change_type !== 'insert' && fetchedReleases.data) {
              const r = fetchedReleases.data.data.releases.find(
                r => r.name === releaseName
              );

              setHasRules(r.rule_ids.length > 0);
            } 
          } else {
            setReleaseEditorValue(
              JSON.stringify(fetchedRelease.data.data, null, 2)
            );

            if (fetchedReleases.data) {
              const r = fetchedReleases.data.data.releases.find(
                r => r.name === releaseName
              );
  
              setProductTextValue(r.product);
              setDataVersion(r.data_version);
              setHasRules(r.rule_ids.length > 0);
            }
          }
        }
      );
    }

    fetchProducts();
  }, [releaseName]);

  const handleProductChange = value => {
    setProductTextValue(value);
  };

  const handleReleaseNameChange = ({ target: { value } }) => {
    setReleaseNameValue(value);
  };

  const handleReleaseEditorChange = value => {
    setReleaseEditorValue(value);
  };

  const handleReleaseCreate = async () => {
    const { error } = await createRel(releaseNameValue, productTextValue, releaseEditorValue);

    if (!error) {
      props.history.push(`/releases#${releaseNameValue}`);
    }
  };
  const handleReleaseUpdate = async () => {
    // todo: handle updating an existing scheduled change
    const when = (new Date()).getTime() + 5000;

    if (scId) {
      const { error } = await updateSC({
        scId,
        when,
        sc_data_version: scDataVersion,
        data_version: dataVersion,
        data: releaseEditorValue,
      });
    } else {
      const { error } = await addSC({
        change_type: 'update',
        when,
        name: releaseNameValue,
        product: productTextValue,
        data: releaseEditorValue,
        data_version: dataVersion,
      });
    }

    if (!error) {
      props.history.push(`/releases#${releaseNameValue}`);
    }
  };
  const handleReleaseDelete = async () => {
    const { error } = await delRelease({
      name: releaseNameValue,
      dataVersion,
    });

    if (!error) {
      props.history.push('/releases');
    };
  };

  return (
    <Dashboard
      title={isNewRelease ? 'Create Release' : `Update Release ${releaseName}`}>
      {isLoading && <Spinner loading />}
      {!isLoading && error && <ErrorPanel fixed error={error} />}
      {!isLoading && (
        <Fragment>
          <TextField
            disabled={!isNewRelease}
            fullWidth
            label="Release"
            onChange={handleReleaseNameChange}
            value={releaseNameValue}
          />
          <br />
          <br />
          <AutoCompleteText
            onValueChange={handleProductChange}
            value={productTextValue}
            getSuggestions={
              products.data && getSuggestions(products.data.data.product)
            }
            label="Product"
            required
            disabled={!isNewRelease}
            inputProps={{
              autoFocus: true,
              fullWidth: true,
            }}
          />
          <br />
          <br />
          <CodeEditor
            onChange={handleReleaseEditorChange}
            value={releaseEditorValue}
          />
          <br />
          <br />
          <Fragment>
            <Tooltip title={isNewRelease ? 'Create Release' : 'Update Release'}>
              <Fab
                disabled={actionLoading}
                onClick={
                  isNewRelease ? handleReleaseCreate : handleReleaseUpdate
                }
                color="primary"
                className={classNames(classes.saveButton, {
                  [classes.secondFab]: !isNewRelease,
                  [classes.fab]: isNewRelease,
                })}>
                <ContentSaveIcon />
              </Fab>
            </Tooltip>
            {!isNewRelease && (
              <SpeedDial ariaLabel="Secondary Actions">
                <SpeedDialAction
                  disabled={actionLoading || hasRules}
                  icon={<DeleteIcon />}
                  tooltipOpen
                  tooltipTitle="Delete Release"
                  onClick={handleReleaseDelete}
                />
              </SpeedDial>
            )}
          </Fragment>
        </Fragment>
      )}
    </Dashboard>
  );
}
