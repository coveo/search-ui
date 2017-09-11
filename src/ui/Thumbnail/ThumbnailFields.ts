import { Initialization } from '../Base/Initialization';

const fields = [
  'outlookformacuri',
  'outlookuri',
  'connectortype',
  'urihash', //     ⎫
  'collection', //   ⎬--- analytics
  'source' //        ⎭
];

export function registerFields() {
  Initialization.registerComponentFields('Thumbnail', fields);
}
