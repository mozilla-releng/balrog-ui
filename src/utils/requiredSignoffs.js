export default (rule, rs) => {
  if (rule.product !== rs.product) {
    return false;
  }

  if (
    rule.channel !== rs.channel &&
    (rule.channel.endsWith('*') &&
      rule.channel.substring(0, rule.channel.length - 1) !== rs.channel)
  ) {
    return false;
  }

  return true;
};
