import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyTab() {
  LazyInitialization.registerLazyComponent('Tab', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Tab'],
        () => {
          let loaded = require<IComponentDefinition>('./Tab.ts')['Tab'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Tab', resolve),
        'Tab'
      );
    });
  });
}
