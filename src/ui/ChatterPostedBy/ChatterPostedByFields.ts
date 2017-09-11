import { Initialization } from '../Base/Initialization';

const fields = ['sfcreatedby', 'sfcreatedbyid', 'sffeeditemid', 'sfuserid', 'sfinsertedbyid', 'sfparentid', 'sfparentname'];

export function registerFields() {
  Initialization.registerComponentFields('ChatterPostedBy', fields);
}
