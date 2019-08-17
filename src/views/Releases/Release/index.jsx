import React, { Fragment, useState, useEffect } from 'react';
import classNames from 'classnames';
import CodeEditor from '@mozilla-frontend-infra/components/CodeEditor';
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
import useAction from '../../../hooks/useAction';
import { getRelease } from '../../../services/releases';
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
  const [release, fetchRelease] = useAction(getRelease);
  const [products, fetchProducts] = useAction(getProducts);
  const isLoading = release.loading || products.loading;
  // TODO: Fill actionLoading when hooking up mutations
  const actionLoading = false;
  const error = release.error || products.error;

  useEffect(() => {
    if (releaseName) {
      fetchRelease(releaseName).then(({ data }) => {
        if (data) {
          setReleaseEditorValue(JSON.stringify(data.data, null, 2));
          setProductTextValue(data.data.product);
        }
      });
    } else {
      fetchProducts();
    }
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

  // TODO: Add mutations
  const handleReleaseCreate = () => {};
  const handleReleaseUpdate = () => {};
  const handleReleaseDelete = () => {};

  return (
    <Dashboard
      title={isNewRelease ? 'Create Release' : `Update Release ${releaseName}`}>
      {isLoading && <Spinner loading />}
      {!isLoading && error && <ErrorPanel fixed error={error} />}
      {!isLoading && (
        <Fragment>
          <TextField
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
            inputProps={{
              autoFocus: true,
              fullWidth: true,
              disabled: !isNewRelease,
            }}
          />
          <br />
          <br />
          <CodeEditor
            mode="json"
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
                  disabled={actionLoading}
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
