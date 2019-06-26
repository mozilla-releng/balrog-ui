import tryCatch from '../../../utils/tryCatch';
import { deleteRule } from '../../../services/rules';

export default async rule => {
  // TODO: why can't we index the result to just get the error?
  // await stops working if we do
  const result = await tryCatch(
    deleteRule({
      ruleId: rule.rule_id,
      dataVersion: rule.data_version,
    })
  );

  if (result[0]) {
    const errorMsg =
      result[0].response.data.exception ||
      result[0].response.data.detail ||
      'Unknown Error';

    throw new Error(errorMsg);
  }
};
