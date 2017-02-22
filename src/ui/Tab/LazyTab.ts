import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyTab() {
  Initialization.registerLazyComponent('Tab', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Tab'], () => {
        let loaded = require<IComponentDefinition>('./Tab.ts')['Tab'];
        loaded.doExport();
        resolve(loaded);
      }, 'Tab');
    });
  });
}
