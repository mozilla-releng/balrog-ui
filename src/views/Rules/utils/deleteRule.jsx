import tryCatch from '../../../utils/tryCatch';
import { deleteRule, addScheduledChange } from '../../../services/rules';

export default async rule => {
  const [error] = await tryCatch(
    rule.sc
      ? deleteRule({
          ruleId: rule.rule_id,
          dataVersion: rule.data_version,
        })
      : addScheduledChange({
          ruleId: rule.rule_id,
          dataVersion: rule.data_version,
          change_type: 'delete',
          when: new Date().getTime() + 5000,
        })
  );

  if (error) {
    const errorMsg =
      (error.response &&
        (error.response.data.exception || error.response.data.detail)) ||
      'Unknown Error';

    throw new Error(errorMsg);
  }
};
