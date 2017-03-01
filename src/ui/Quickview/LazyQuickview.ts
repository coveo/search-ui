import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyQuickview() {
  Initialization.registerLazyComponent('Quickview', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Quickview'], () => {
        let loaded = require<IComponentDefinition>('./Quickview.ts')['Quickview'];
        lazyExport(loaded, resolve);
      }, 'Quickview');
    });
  });
}
