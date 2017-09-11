import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyChatterLikedBy() {
  LazyInitialization.registerLazyComponent('ChatterLikedBy', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ChatterLikedBy'],
        () => {
          let loaded = require<IComponentDefinition>('./ChatterLikedBy.ts')['ChatterLikedBy'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ChatterLikedBy', resolve),
        'ChatterLikedBy'
      );
    });
  });
}
