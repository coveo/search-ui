import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazySettings() {
  Initialization.registerLazyComponent('Settings', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Settings'], () => {
        let loaded = require<IComponentDefinition>('./Settings.ts')['Settings'];
        loaded.doExport();
        resolve(loaded);
      }, 'Settings');
    });
  });
}
