import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyShareQuery() {
  Initialization.registerLazyComponent('ShareQuery', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ShareQuery'], () => {
        let loaded = require<IComponentDefinition>('./ShareQuery.ts')['ShareQuery'];
        loaded.doExport();
        resolve(loaded);
      }, 'ShareQuery');
    });
  });
}
