import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFacet() {
  LazyInitialization.registerLazyComponent('Facet', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Facet'],
        () => {
          let loaded = require<IComponentDefinition>('./Facet.ts')['Facet'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Facet', resolve),
        'Facet'
      );
    });
  });
}
