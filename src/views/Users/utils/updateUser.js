import { equals } from 'ramda';
import {
  addRole,
  removeRole,
  addScheduledPermissionChange,
  updateScheduledPermissionChange,
  deleteScheduledPermissionChange,
} from '../../../services/users';
import { supportsActionRestriction } from '../../../utils/userUtils';

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

  // TODO: need to add support for grabbing scheduled permission changes to ViewUser
  // and figure out where those will be in the data structure. maybe compare to the rules
  // edit page to figure it out?
  return Promise.all(
    [].concat(
      additionalRoles.map(role => addRole(username, role.name)),
      removedRoles.map(role =>
        removeRole(username, role.name, role.data_version)
      ),
      permissions.map(permission => {
        let skip = false;
        originalPermissions.forEach(value => {
          const newOptions = permission.sc ? permission.sc.options : permission.options;
          const originalOptions = value.sc ? value.sc.options : value.options;

          if (value.name === permission.name && equals(newOptions, originalOptions)) {
            skip = true;
          }
        });

        if (skip) {
          return;
        }

        if (permission.sc && equals(permission.options, permission.sc.options)) {
          return deleteScheduledPermissionChange({
            scId: permission.sc.sc_id,
            scDataVersion: permission.sc.sc_data_version,
          });
        }

        const options = {products: permission.sc ? permission.sc.options.products : permission.options.products}
        if (supportsActionRestriction(permission.name)) {
          options.actions = permission.sc ? permission.sc.options.actions : permission.options.actions;
        }

        if (permission.sc) {
          return updateScheduledPermissionChange({
            username,
            permission: permission.name,
            options,
            dataVersion: permission.data_version,
            scId: permission.sc.sc_id,
            scDataVersion: permission.sc.data_version,
            when: new Date().getTime() + 5000,
          });
        }

        return addScheduledPermissionChange({
          username,
          permission: permission.name,
          options,
          dataVersion: permission.data_version,
          changeType: 'update',
          when: new Date().getTime() + 5000,
        });
      }),
      additionalPermissions.map(permission => {}),
      removedPermissions.map(permission => {})
    )
  );
};
