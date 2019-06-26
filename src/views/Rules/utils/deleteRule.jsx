import tryCatch from '../../../utils/tryCatch';
import { deleteRule } from '../../../services/rules';

export default async rule => {
  // TODO: why can't we index the result to just get the error?
  // await stops working if we do
  const error = (await tryCatch(
    deleteRule({
      ruleId: rule.rule_id,
      dataVersion: rule.data_version,
    })
  ))[0];

  if (error) {
    const errorMsg =
      error.response.data.exception ||
      error.response.data.detail ||
      'Unknown Error';

    throw new Error(errorMsg);
  }
};
