import { USER_SESSION } from './constants';

export default () => {
  const userSession = localStorage.getItem(USER_SESSION);

  if (!userSession) {
    return false;
  }

  const user = JSON.parse(userSession);
  const expires = new Date(user.expiration);
  const now = new Date();

  if (expires > now) {
    return true;
  }

  return false;
};
