import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyQueryDuration() {
  Initialization.registerLazyComponent('QueryDuration', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./QueryDuration'], () => {
        let loaded = require<IComponentDefinition>('./QueryDuration.ts')['QueryDuration'];
        loaded.doExport();
        resolve(loaded);
      }, 'QueryDuration');
    });
  });
}
