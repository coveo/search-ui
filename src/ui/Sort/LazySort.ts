import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazySort() {
  Initialization.registerLazyComponent('Sort', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Sort'], () => {
        let loaded = require<IComponentDefinition>('./Sort.ts')['Sort'];
        loaded.doExport();
        resolve(loaded);
      }, 'Sort');
    });
  });
}
