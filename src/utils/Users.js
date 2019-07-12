const niceJoin = array =>
  array.concat(array.splice(-2, 2).join(' and ')).join(', ');
const permissionStrings = (productStr, actionStr) => ({
  admin: `is a full fledged administrator ${productStr}`,
  emergency_shutoff: `is allowed to ${actionStr} on Emergency Shutoffs ${productStr}`,
  release: `is allowed to ${actionStr} Releases ${productStr}`,
  release_locale: `is allowed to ${actionStr} on locale sections of Releases ${productStr}`,
  release_read_only: `is allowed to ${actionStr} the read only flag of Releases ${productStr}`,
  rule: `is allowed to ${actionStr} on Rules ${productStr}`,
  permission: `is allowed to ${actionStr} User Permissions`,
  required_signoff: `is allowed to ${actionStr} on Required Signoff configuration ${productStr}`,
  scheduled_change: `is allowed to ${actionStr} Scheduled Changes`,
});
const getPermissionString = (permission, actions, products) => {
  let actionStr = 'perform any action';
  let productStr = 'for all products';

  if (actions.length > 0) {
    actionStr = niceJoin(actions);
  }

  if (products.length > 0) {
    const tmp = niceJoin(products);

    productStr = `for ${tmp}`;
  }

  return permissionStrings(productStr, actionStr)[permission];
};

const getRolesString = roles => {
  const joined = niceJoin(Array.from(roles));
  let roleStr = 'role';

  if (roles.length > 1) {
    roleStr = 'roles';
  }

  return `${joined} ${roleStr}`;
};

const permissionRestrictionMappings = {
  admin: {
    restrict_products: true,
    restrict_actions: false,
    supported_actions: [],
  },
  emergency_shutoff: {
    restrict_products: true,
    restrict_actions: true,
    supported_actions: ['create', 'modify'],
  },
  rule: {
    restrict_products: true,
    restrict_actions: true,
    supported_actions: ['create', 'modify', 'delete'],
  },
  release: {
    restrict_products: true,
    restrict_actions: true,
    supported_actions: ['create', 'modify', 'delete'],
  },
  release_read_only: {
    restrict_products: true,
    restrict_actions: true,
    supported_actions: ['set', 'unset'],
  },
  release_locale: {
    restrict_products: true,
    restrict_actions: true,
    supported_actions: ['modify'],
  },
  required_signoff: {
    restrict_products: true,
    restrict_actions: true,
    supported_actions: ['create', 'modify', 'delete'],
  },
  permission: {
    restrict_products: true,
    restrict_actions: true,
    supported_actions: ['create', 'modify', 'delete'],
  },
  scheduled_change: {
    restrict_products: true,
    restrict_actions: true,
    supported_actions: ['enact'],
  },
};
const allPermissions = [
  'admin',
  'emergency_shutoff',
  'rule',
  'release',
  'release_read_only',
  'release_locale',
  'required_signoff',
  'permission',
  'scheduled_change',
];
const supportsProductRestriction = permission => {
  if (!Object.keys(permissionRestrictionMappings).includes(permission)) {
    return false;
  }

  return permissionRestrictionMappings[permission].restrict_products;
};

const supportsActionRestriction = permission => {
  if (!Object.keys(permissionRestrictionMappings).includes(permission)) {
    return false;
  }

  return permissionRestrictionMappings[permission].restrict_actions;
};

const getSupportedActions = permission => {
  if (!Object.keys(permissionRestrictionMappings).includes(permission)) {
    return [];
  }

  return permissionRestrictionMappings[permission].supported_actions;
};

// eslint-disable-next-line import/prefer-default-export
export {
  getPermissionString,
  getRolesString,
  permissionRestrictionMappings,
  allPermissions,
  supportsProductRestriction,
  supportsActionRestriction,
  getSupportedActions,
};
