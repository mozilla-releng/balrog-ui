import * as realAxios from 'axios';
import { BASE_URL, USER_SESSION } from './constants';

const { accessToken } = JSON.parse(
  localStorage.getItem(USER_SESSION)
).authResult;
const axios = realAxios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export default axios;
