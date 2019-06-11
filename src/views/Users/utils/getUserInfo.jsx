import { getUserInfo } from '../../../utils/Users';
import tryCatch from '../../../utils/tryCatch';

export default async users => {
  const userInfo = {};
  const [error, result] = await tryCatch(
    Promise.all([].concat(users.map(user => getUserInfo(user))))
  );

  if (error) {
    const errorMsg =
      error.response.data.exception ||
      error.response.data.detail ||
      'Unknown error';

    throw new Error(errorMsg);
  }

  result.forEach(user => {
    userInfo[user.data.username] = {
      roles: user.data.roles,
      permissions: user.data.permissions,
    };
  });

  return userInfo;
};
