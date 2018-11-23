import { Initialization } from '../Base/Initialization';

const fields = ['objecttype', 'filetype'];

export function registerFields() {
  Initialization.registerComponentFields('Icon', fields);
}
