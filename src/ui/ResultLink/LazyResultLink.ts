import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyResultLink() {
  Initialization.registerLazyComponent('ResultLink', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ResultLink'], () => {
        let loaded = require<IComponentDefinition>('./ResultLink.ts')['ResultLink'];
        loaded.doExport();
        resolve(loaded);
      }, 'ResultLink');
    });
  });
}
