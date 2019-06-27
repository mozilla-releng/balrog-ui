import tryCatch from '../../../utils/tryCatch';
import { deleteRule } from '../../../services/rules';

export default async rule => {
  const [error] = await tryCatch(
    deleteRule({
      ruleId: rule.rule_id,
      dataVersion: rule.data_version,
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
