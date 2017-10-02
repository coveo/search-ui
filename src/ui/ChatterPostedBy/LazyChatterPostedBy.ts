import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyChatterPostedBy() {
  LazyInitialization.registerLazyComponent('ChatterPostedBy', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ChatterPostedBy'],
        () => {
          let loaded = require<IComponentDefinition>('./ChatterPostedBy.ts')['ChatterPostedBy'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ChatterPostedBy', resolve),
        'ChatterPostedBy'
      );
    });
  });
}
