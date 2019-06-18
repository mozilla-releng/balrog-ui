import { stringify } from 'qs';
import axios from 'axios';

const getRules = () => axios.get('/rules');
const getRule = id => axios.get(`/rules/${id}`);
const getChannels = () => axios.get('/rules/columns/channel');
const getProducts = () => axios.get('/rules/columns/product');
const getHistory = (id, limit, page) =>
  axios.get(`/${id}/revisions?${stringify({ limit, page })}`);
// const getRule = () => axios.get();
// const updateRule = () => axios.put();
const deleteRule = ({ ruleId, dataVersion }) =>
  axios.delete(`/rules/${ruleId}`, { params: { data_version: dataVersion } });
// const addRule = () => axios.post();
// const revertRule = () => axios.post();
const getScheduledChanges = all => {
  if (!all || all === true) {
    return axios.get(`/scheduled_changes/rules?${stringify({ all: 1 })}`);
  }

  return axios.get('/scheduled_changes/rules/');
};

const getScheduledChange = ruleId =>
  axios.get(`/scheduled_changes/rules/${ruleId}`);

// const addScheduledChange = () => axios.get();
// const getScheduledChangeHistory = () => axios.get();
// const updateScheduledChange = () => axios.get();
// const deleteScheduledChange = () => axios.get();
// const signoffOnScheduledChange = () => axios.get();
// const revokeSignoffOnScheduledChange = () => axios.get();
// const ruleSignoffsRequired = () => axios.get();

// Rules factory
export {
  getRules,
  deleteRule,
  getRule,
  getChannels,
  getProducts,
  getHistory,
  getScheduledChanges,
  getScheduledChange,
};
