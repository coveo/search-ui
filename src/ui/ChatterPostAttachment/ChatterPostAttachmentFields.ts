import { Initialization } from '../Base/Initialization';

const fields = ['sfcontentversionid', 'sffeeditemid', 'sfcontentfilename', 'sftitle', 'sf_title'];

export function registerFields() {
  Initialization.registerComponentFields('ChatterPostAttachment', fields);
}
