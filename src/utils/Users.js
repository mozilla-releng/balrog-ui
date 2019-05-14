import axios from 'axios';
import { USER_SESSION } from './constants';

const baseUrl = `${process.env.BALROG_ROOT_URL}/api`;
const getUsers = () => axios.get(`${baseUrl}/users`);
const getUserInfo = username => {
  const session = localStorage.getItem(USER_SESSION);
  const user = JSON.parse(session);
  const { accessToken } = user.authResult;
  const url = `${baseUrl}/users/${username}`;
  const headers = { Authorization: `Bearer ${accessToken}` };

  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  return axios.get(url, { headers });
};

const permissionStrings = (productStr, actionStr) => ({
  admin: `is a full fledged administrator ${productStr}`,
  emergency_shutoff: `is allowed to ${actionStr} ${productStr} emergency shutoffs`,
  release: `is allowed to ${actionStr} ${productStr} Releases`,
  release_locale: `is allowed to ${actionStr} locale sections of ${productStr} Releases`,
  release_read_only: `is allowed to ${actionStr} the read only flag of ${productStr} Releases`,
  permission: `is allowed to ${actionStr} user permissions`,
  required_signoff: `is allowed to ${actionStr} required signoff configuration`,
  scheduled_change: `is allowed to ${actionStr} scheduled changes`,
});

// eslint-disable-next-line import/prefer-default-export
export { getUsers, getUserInfo, permissionStrings };
