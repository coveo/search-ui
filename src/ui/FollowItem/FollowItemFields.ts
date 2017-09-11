import { Initialization } from '../Base/Initialization';

const fields = ['urihash'];

export function registerFields() {
  Initialization.registerComponentFields('FollowItem', fields);
}
