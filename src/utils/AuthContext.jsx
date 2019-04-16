import { createContext } from 'react';

export default createContext({
  authorize: Function.prototype,
  unauthorize: Function.prototype,
  user: null,
});
