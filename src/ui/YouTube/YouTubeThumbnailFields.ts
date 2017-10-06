import { Initialization } from '../Base/Initialization';

export const fields = ['ytthumbnailurl'];

export function registerFields() {
  Initialization.registerComponentFields('YouTubeThumbnail', fields);
}
