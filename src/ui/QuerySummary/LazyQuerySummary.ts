import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyQuerySummary() {
  Initialization.registerLazyComponent('QuerySummary', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./QuerySummary'], () => {
        let loaded = require<IComponentDefinition>('./QuerySummary.ts')['QuerySummary'];
        loaded.doExport();
        resolve(loaded);
      }, 'QuerySummary');
    });
  });
}
