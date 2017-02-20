import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyCardActionBar() {
  Initialization.registerLazyComponent('CardActionBar', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./CardActionBar'], () => {
        let loaded = require<IComponentDefinition>('./CardActionBar.ts')['CardActionBar'];
        loaded.doExport();
        resolve(loaded);
      }, 'CardActionBar');
    });
  });
}
