import { USER_SESSION } from './constants';

const isLoggedIn = () => {
  const session = localStorage.getItem(USER_SESSION);
  const user = JSON.parse(session);

  if (user) {
    return true;
  }

  return false;
};

// eslint-disable-next-line import/prefer-default-export
export { isLoggedIn };
