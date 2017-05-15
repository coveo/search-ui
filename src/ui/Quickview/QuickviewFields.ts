import { Initialization } from '../Base/Initialization';

const fields = [
  'urihash', // analytics
  'collection', // analytics
  'source', // analytics,
  'author' // analytics
];

export function registerFields() {
  Initialization.registerComponentFields('Quickview', fields);
}


