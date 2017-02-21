import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyResultList() {
  Initialization.registerLazyComponent('ResultList', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ResultList'], () => {
        let loaded = require<IComponentDefinition>('./ResultList.ts')['ResultList'];
        loaded.doExport();
        resolve(loaded);
      }, 'ResultList');
    });
  });
}
