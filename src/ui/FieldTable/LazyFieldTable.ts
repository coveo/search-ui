import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyFieldTable() {
  Initialization.registerLazyComponent('FieldTable', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./FieldTable'], () => {
        let loaded = require<IComponentDefinition>('./FieldTable.ts')['FieldTable'];
        loaded.doExport();
        resolve(loaded);
      }, 'FieldTable');
    });
  });
}
