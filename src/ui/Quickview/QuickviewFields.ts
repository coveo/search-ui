import { Initialization } from '../Base/Initialization';

const fields = [
  'urihash', // analytics
  'collection', // analytics
  'source', // analytics,
  'author', // analytics,
  'date' // used in header of the quickview
];

export function registerFields() {
  Initialization.registerComponentFields('Quickview', fields);
}
