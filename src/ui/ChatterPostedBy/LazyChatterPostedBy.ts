import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyChatterPostedBy() {
  Initialization.registerLazyComponent('ChatterPostedBy', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ChatterPostedBy'], () => {
        let loaded = require<IComponentDefinition>('./ChatterPostedBy.ts')['ChatterPostedBy'];
        loaded.doExport();
        resolve(loaded);
      }, 'ChatterPostedBy');
    });
  });
}
