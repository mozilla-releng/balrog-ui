import { USER_SESSION } from './constants';

export default () => {
  if (localStorage.getItem(USER_SESSION)) {
    return true;
  }

  return false;
};
