import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultLayoutSelector() {
  LazyInitialization.registerLazyComponent(
    'ResultLayoutSelector',
    () => {
      return new Promise((resolve, reject) => {
        require.ensure(
          ['./ResultLayoutSelector'],
          () => {
            let loaded = require<IComponentDefinition>('./ResultLayoutSelector.ts')['ResultLayoutSelector'];
            lazyExport(loaded, resolve);
          },
          LazyInitialization.buildErrorCallback('ResultLayoutSelector', resolve),
          'ResultLayoutSelector'
        );
      });
    },
    ['ResultLayout']
  );
}
