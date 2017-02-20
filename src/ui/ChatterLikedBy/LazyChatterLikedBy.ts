import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyChatterLikedBy() {
  Initialization.registerLazyComponent('ChatterLikedBy', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ChatterLikedBy'], () => {
        let loaded = require<IComponentDefinition>('./ChatterLikedBy.ts')['ChatterLikedBy'];
        loaded.doExport();
        resolve(loaded);
      }, 'ChatterLikedBy');
    });
  });
}
