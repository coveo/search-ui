import { Initialization } from '../Base/Initialization';

const fields = ['sflikedby', 'sflikedbyid', 'clickableuri', 'sffeeditemid'];

export function registerFields() {
  Initialization.registerComponentFields('ChatterLikedBy', fields);
}
