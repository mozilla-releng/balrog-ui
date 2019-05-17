import { number, shape, string } from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const signoffEntry = shape({
  channel: string,
  data_version: number,
  role: string,
  signoffs_required: number,
});
