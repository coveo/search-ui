import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyTab() {
  Initialization.registerLazyComponent('Tab', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Tab'], () => {
        let loaded = require<IComponentDefinition>('./Tab.ts')['Tab'];
        lazyExport(loaded, resolve);
      }, 'Tab');
    });
  });
}
