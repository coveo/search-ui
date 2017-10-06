import { Initialization } from '../Base/Initialization';

const fields = ['sfcontentversionid', 'sffeeditemid', 'sfcontentfilename'];

export function registerFields() {
  Initialization.registerComponentFields('ChatterPostAttachment', fields);
}
