import axios from 'axios';

const getReleases = () => axios.get('/releases');
const getReleaseNames = () => axios.get(`/releases?names_only=1`);
const deleteRelease = ({ name, dataVersion }) =>
  axios.delete(`/releases/${name}`, { params: { data_version: dataVersion } });
const setReadOnly = ({ name, readOnly, dataVersion }) =>
  axios.put(`/releases/${name}/read_only`, {
    read_only: readOnly,
    data_version: dataVersion,
  });

// Releases factory
// eslint-disable-next-line import/prefer-default-export
export { getReleases, getReleaseNames, deleteRelease, setReadOnly };
