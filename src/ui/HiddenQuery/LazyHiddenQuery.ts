import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyHiddenQuery() {
  Initialization.registerLazyComponent('HiddenQuery', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./HiddenQuery'], () => {
        let loaded = require<IComponentDefinition>('./HiddenQuery.ts')['HiddenQuery'];
        loaded.doExport();
        resolve(loaded);
      }, 'HiddenQuery');
    });
  });
}
