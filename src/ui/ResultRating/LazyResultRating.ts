import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultRating() {
  LazyInitialization.registerLazyComponent('ResultRating', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ResultRating'],
        () => {
          let loaded = require<IComponentDefinition>('./ResultRating.ts')['ResultRating'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ResultRating', resolve),
        'ResultRating'
      );
    });
  });
}
