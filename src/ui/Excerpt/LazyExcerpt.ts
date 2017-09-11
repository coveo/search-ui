import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyExcerpt() {
  LazyInitialization.registerLazyComponent('Excerpt', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Excerpt'],
        () => {
          let loaded = require<IComponentDefinition>('./Excerpt.ts')['Excerpt'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Excerpt', resolve),
        'Excerpt'
      );
    });
  });
}
