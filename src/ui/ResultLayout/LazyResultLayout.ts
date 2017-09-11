import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultLayout() {
  LazyInitialization.registerLazyComponent('ResultLayout', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ResultLayout'],
        () => {
          let loaded = require<IComponentDefinition>('./ResultLayout.ts')['ResultLayout'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ResultLayout', resolve),
        'ResultLayout'
      );
    });
  });
}
