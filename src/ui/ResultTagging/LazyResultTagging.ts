import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyResultTagging() {
  Initialization.registerLazyComponent('ResultTagging', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ResultTagging'], () => {
        let loaded = require<IComponentDefinition>('./ResultTagging.ts')['ResultTagging'];
        loaded.doExport();
        resolve(loaded);
      }, 'ResultTagging');
    });
  });
}
