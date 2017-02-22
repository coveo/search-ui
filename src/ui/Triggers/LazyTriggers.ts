import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyTriggers() {
  Initialization.registerLazyComponent('Triggers', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Triggers'], () => {
        let loaded = require<IComponentDefinition>('./Triggers.ts')['Triggers'];
        loaded.doExport();
        resolve(loaded);
      }, 'Triggers');
    });
  });
}
