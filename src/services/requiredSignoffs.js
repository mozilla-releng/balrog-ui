import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const getRequiredSignoffs = objectName =>
  axios.get(`${BASE_URL}/${objectName}`);
const getScheduledChanges = objectName =>
  axios.get(`${BASE_URL}/scheduled_changes/${objectName}`);
const updateRequiredSignoff = params => {
  const { useScheduledChange, ...postData } = params;
  const type = postData.channel ? 'product' : 'permissions';
  const url = useScheduledChange
    ? `${BASE_URL}/scheduled_changes/required_signoffs/${type}`
    : `${BASE_URL}/required_signoffs/${type}`;
  // TODO: where can we set this globally as a default?
  const { accessToken } = JSON.parse(
    localStorage.getItem('react-auth0-session')
  ).authResult;

  return axios.post(url, postData, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

// requiredSignoffs factory
export default {
  getRequiredSignoffs,
  getScheduledChanges,
  updateRequiredSignoff,
};
