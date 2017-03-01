import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyChatterPostedBy() {
  Initialization.registerLazyComponent('ChatterPostedBy', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ChatterPostedBy'], () => {
        let loaded = require<IComponentDefinition>('./ChatterPostedBy.ts')['ChatterPostedBy'];
        lazyExport(loaded, resolve);
      }, 'ChatterPostedBy');
    });
  });
}
