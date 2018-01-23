import { Initialization } from '../Base/Initialization';

export const fields = [
  'outlookformacuri',
  'outlookuri',
  'connectortype',
  'urihash', // analytics
  'collection', // analytics
  'source', // analytics
  'author' // analytics
];

export function registerFields() {
  Initialization.registerComponentFields('ResultLink', fields);
}
