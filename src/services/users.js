import axios from 'axios';

const getUsers = () => axios.get('/users');
const getUserInfo = username => axios.get(`/users/${username}`);
const addRole = (username, role) =>
  axios.put(`/users/${username}/roles/${role}`);
const removeRole = (username, role, dataVersion) =>
  axios.delete(`/users/${username}/roles/${role}`, {
    params: { data_version: dataVersion },
  });
const addPermission = ({ username, permission, options }) => {};
const updatePermission = ({ username, permission, options, dataVersion }) =>
  axios.put(
    `/users/${username}/permissions/${permission}`,
    {
      options: JSON.stringify(options),
      data_version: dataVersion,
    }
  );
const deletePermission = ({ username, permission, dataVersion }) => {};
const addScheduledPermissionChange = ({ username, permission, options, dataVersion, changeType, when }) =>
  axios.post(
    '/scheduled_changes/permissions',
    {
      username,
      permission,
      data_version: dataVersion,
      options: JSON.stringify(options),
      change_type: changeType,
      when,
    }
  );

const updateScheduledPermissionChange = ({ username, permission, options, dataVersion, scId, scDataVersion, when }) =>
  axios.post(
    `/scheduled_changes/permissions/${scId}`,
    {
      username,
      permission,
      data_version: dataVersion,
      options: JSON.stringify(options),
      sc_data_version: scDataVersion,
      when,
    },
  );

export {
  getUsers,
  getUserInfo,
  addRole,
  removeRole,
  addPermission,
  updatePermission,
  deletePermission,
  addScheduledPermissionChange,
  updateScheduledPermissionChange,
};
