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

const niceJoin = array =>
  array.concat(array.splice(-2, 2).join(' and ')).join(', ');
const permissionStrings = (productStr, actionStr) => ({
  admin: `is a full fledged administrator ${productStr}`,
  emergency_shutoff: `is allowed to ${actionStr} on Emergency Shutoffs ${productStr}`,
  release: `is allowed to ${actionStr} Releases ${productStr}`,
  release_locale: `is allowed to ${actionStr} on locale sections of Releases ${productStr}`,
  release_read_only: `is allowed to ${actionStr} the read only flag of Releases ${productStr}`,
  rule: `is allowed to ${actionStr} on Rules ${productStr}`,
  permission: `is allowed to ${actionStr} User Permissions`,
  required_signoff: `is allowed to ${actionStr} on Required Signoff configuration ${productStr}`,
  scheduled_change: `is allowed to ${actionStr} Scheduled Changes`,
});
const getPermissionString = (permission, actions, products) => {
  let actionStr = 'perform any action';
  let productStr = 'for all products';

  if (actions.length > 0) {
    actionStr = niceJoin(actions);
  }

  if (products.length > 0) {
    const tmp = niceJoin(products);

    productStr = `for ${tmp}`;
  }

  return permissionStrings(productStr, actionStr)[permission];
};

const getRolesString = roles => {
  const joined = niceJoin(roles);
  let roleStr = 'role';

  if (roles.length > 1) {
    roleStr = 'roles';
  }

  return `${joined} ${roleStr}`;
};

// eslint-disable-next-line import/prefer-default-export
export { getUsers, getUserInfo, getPermissionString, getRolesString };
