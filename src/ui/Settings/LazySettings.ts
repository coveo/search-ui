import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazySettings() {
  LazyInitialization.registerLazyComponent('Settings', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Settings'],
        () => {
          let loaded = require<IComponentDefinition>('./Settings.ts')['Settings'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Settings', resolve),
        'Settings'
      );
    });
  });
}
