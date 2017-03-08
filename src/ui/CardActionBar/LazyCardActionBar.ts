import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyCardActionBar() {
  Initialization.registerLazyComponent('CardActionBar', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./CardActionBar'], () => {
        let loaded = require<IComponentDefinition>('./CardActionBar.ts')['CardActionBar'];
        lazyExport(loaded, resolve);
      }, 'CardActionBar');
    });
  });
}
