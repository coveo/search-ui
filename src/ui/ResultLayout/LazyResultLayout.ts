import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultLayout() {
  Initialization.registerLazyComponent('ResultLayout', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ResultLayout'], () => {
        let loaded = require<IComponentDefinition>('./ResultLayout.ts')['ResultLayout'];
        lazyExport(loaded, resolve);
      }, 'ResultLayout');
    });
  });
}
