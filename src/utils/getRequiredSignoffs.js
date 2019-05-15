import { OBJECT_NAMES } from './constants';
import RequiredSignoffs from '../views/Signoffs/ListSignoffs/RequiredSignoffs';
import rsService from '../services/requiredSignoffs';

// Holds ALL of the Required Signoffs - product, permissions,
// and scheduled changes for each
export default async () => {
  const requiredSignoffs = new RequiredSignoffs();
  const [
    {
      data: { required_signoffs: productRS },
    },
    {
      data: { required_signoffs: permissionsRS },
    },
    {
      data: { scheduled_changes: productSC },
    },
    {
      data: { scheduled_changes: permissionsSC },
    },
  ] = await Promise.all([
    rsService.getRequiredSignoffs(OBJECT_NAMES.PRODUCT_REQUIRED_SIGNOFF),
    rsService.getRequiredSignoffs(OBJECT_NAMES.PERMISSIONS_REQUIRED_SIGNOFF),
    rsService.getScheduledChanges(OBJECT_NAMES.PRODUCT_REQUIRED_SIGNOFF),
    rsService.getScheduledChanges(OBJECT_NAMES.PERMISSIONS_REQUIRED_SIGNOFF),
  ]);

  requiredSignoffs.setProductRequiredSignoffs(productRS);
  requiredSignoffs.setPermissionsRequiredSignoffs(permissionsRS);
  requiredSignoffs.setProductScheduledChanges(productSC);
  requiredSignoffs.setPermissionScheduledChanges(permissionsSC);

  return requiredSignoffs.value();
};
