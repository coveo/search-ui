import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyStarRating() {
  LazyInitialization.registerLazyComponent('StarRating', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./StarRating'],
        () => {
          let loaded = require<IComponentDefinition>('./StarRating.ts')['StarRating'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('StarRating', resolve),
        'StarRating'
      );
    });
  });
}
