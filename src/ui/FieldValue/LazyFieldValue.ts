import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyFieldValue() {
  Initialization.registerLazyComponent('FieldValue', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./FieldValue'], () => {
        let loaded = require<IComponentDefinition>('./FieldValue.ts')['FieldValue'];
        loaded.doExport();
        resolve(loaded);
      }, 'FieldValue');
    });
  });
}
