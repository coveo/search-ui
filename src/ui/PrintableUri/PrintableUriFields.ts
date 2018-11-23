import { Initialization } from '../Base/Initialization';

const fields = ['parents'];

export function registerFields() {
  Initialization.registerComponentFields('PrintableUri', fields);
}
