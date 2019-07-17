import axios from 'axios';

const getUsers = () => axios.get('/users');
const getUserInfo = username => axios.get(`/users/${username}`);
const addRole = (username, role) =>
  axios.put(`/users/${username}/roles/${role}`);
const removeRole = (username, role, dataVersion) =>
  axios.delete(`/users/${username}/roles/${role}`, {
    params: { data_version: dataVersion },
  });
const addPermission = (username, permission, options) => {};
const updatePermission = (username, permission, ...postData) => {};
const deletePermission = (username, permission, dataVersion) => {};

export {
  getUsers,
  getUserInfo,
  addRole,
  removeRole,
  addPermission,
  updatePermission,
  deletePermission,
};
