import { getUserInfo } from '../../../services/users';
import tryCatch from '../../../utils/tryCatch';

export default async users => {
  const userInfo = {};
  const result = await Promise.all([].concat(users.map(user => getUserInfo(user))));
  console.log(result);

  result.forEach(user => {
    userInfo[user.data.username] = {
      roles: user.data.roles,
      permissions: user.data.permissions,
    };
  });

  return userInfo;
};
