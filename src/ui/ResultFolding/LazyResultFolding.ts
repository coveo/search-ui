import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyResultFolding() {
  Initialization.registerLazyComponent('ResultFolding', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ResultFolding'], () => {
        let loaded = require<IComponentDefinition>('./ResultFolding.ts')['ResultFolding'];
        loaded.doExport();
        resolve(loaded);
      }, 'ResultFolding');
    });
  });
}
