import {
  addRole,
  removeRole,
  addPermission,
  updatePermission,
  deletePermission,
} from '../../../services/users';

export default params => {
  const {
    username,
    roles,
    originalRoles,
    additionalRoles,
    permissions,
    originalPermissions,
    additionalPermissions,
    requiredSignoffs,
  } = params;
  const currentRoles = roles.map(role => role.name);
  const removedRoles = originalRoles.filter(
    role => !currentRoles.includes(role.name)
  );
  const currentPermissions = permissions.map(p => p.name);
  const removedPermissions = originalPermissions.filter(
    p => !currentPermissions.includes(p.name)
  );

  return Promise.all(
    [].concat(
      additionalRoles.map(role => addRole(username, role.name)),
      removedRoles.map(role =>
        removeRole(username, role.name, role.data_version)
      ),
      permissions.map(permission => {}),
      additionalPermissions.map(permission => {}),
      removedPermissions.map(permission => {})
    )
  );
};
