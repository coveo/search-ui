import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazySettings() {
  Initialization.registerLazyComponent('Settings', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Settings'], () => {
        let loaded = require<IComponentDefinition>('./Settings.ts')['Settings'];
        lazyExport(loaded, resolve);
      }, 'Settings');
    });
  });
}
