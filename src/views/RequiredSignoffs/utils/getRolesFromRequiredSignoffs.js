// Returns an array of roles of the form [role name, required signoffs number]
export default rs => {
  const roles = Object.entries(Object.entries(rs)[0][1].permissions);

  // Formatted roles
  return roles.map(([name, role]) => {
    const isRoleScheduled = 'sc' in role;

    return [
      name,
      isRoleScheduled ? role.sc.signoffs_required : role.signoffs_required,
      {
        isAdditionalRole: false,
        id: Math.random(),
      },
    ];
  });
};
