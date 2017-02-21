import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyQuickview() {
  Initialization.registerLazyComponent('Quickview', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Quickview'], () => {
        let loaded = require<IComponentDefinition>('./Quickview.ts')['Quickview'];
        loaded.doExport();
        resolve(loaded);
      }, 'Quickview');
    });
  });
}
