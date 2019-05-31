import rsService from '../../../services/requiredSignoffs';

// A utlity to holds all of the Required Signoffs - product, permissions,
// and scheduled changes
export default async params => {
  // For an entirely new Required Signoff (eg: a product/channel or
  // product/permissions that has no required roles yet,
  // we do not need to schedule the initial required role, we can
  // insert it directly. For other required roles that may be added,
  // we must schedule them.
  // Required Signoffs that have any existing required roles will
  // always required changes, additions, or deletions to be scheduled.
  const {
    product,
    channel,
    roles,
    originalRoles,
    additionalRoles,
    removedRoles,
    isNewSignoff,
  } = params;
  let useScheduledChange = !isNewSignoff;
  const errors = [];

  await Promise.all(
    Array.concat(
      roles.map(async role => {
        const extraData = role.sc
          ? { sc_data_version: role.sc.data_version }
          : {};
        let skip = false;

        originalRoles.forEach(value => {
          const newSignoffsRequired = role.sc
            ? role.sc.signoffs_required
            : role.signoffs_required;

          if (
            value.name === role.name &&
            value.signoffs_required === newSignoffsRequired
          ) {
            skip = true;
          }
        });

        if (skip) {
          return;
        }

        return rsService.updateRequiredSignoff({
          product,
          channel,
          role: role.name,
          signoffs_required: role.sc
            ? role.sc.signoffs_required
            : role.signoffs_required,
          data_version: role.data_version,
          useScheduledChange: true,
          change_type: 'update',
          when: new Date().getTime() + 5000,
          scId: role.sc ? role.sc.sc_id : null,
          ...extraData,
        });
      }),
      additionalRoles.map(roleItem => {
        const role = roleItem[0];
        // eslint-disable-next-line camelcase
        const signoffs_required = roleItem[1];
        const ret = rsService.updateRequiredSignoff({
          product,
          channel,
          role,
          signoffs_required,
          useScheduledChange,
          change_type: 'insert',
          when: new Date().getTime() + 5000,
        });

        useScheduledChange = true;

        return ret;
      }),
      removedRoles.map(roleItem => {
        const role = roleItem[0];
        // eslint-disable-next-line camelcase
        const signoffs_required = roleItem[1];
        // eslint-disable-next-line camelcase
        const data_version = roleItem[2];
        const ret = rsService.updateRequiredSignoff({
          product,
          channel,
          role,
          signoffs_required,
          data_version,
          useScheduledChange,
          change_type: 'delete',
          when: new Date().getTime() + 5000,
        });

        return ret;
      })
    )
  ).catch(error => {
    const config = JSON.parse(error.config.data);

    errors.push(
      `Error updating ${config.role} role: ${error.response.data.exception}`
    );
  });

  if (errors) {
    throw errors.join();
  }
};
