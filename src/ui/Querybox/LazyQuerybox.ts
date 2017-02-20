import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyQuerybox() {
  Initialization.registerLazyComponent('Querybox', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Querybox'], () => {
        let loaded = require<IComponentDefinition>('./Querybox.ts')['Querybox'];
        loaded.doExport();
        resolve(loaded);
      }, 'Querybox');
    });
  });
}
