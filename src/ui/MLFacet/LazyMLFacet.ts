import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyMLFacet() {
  LazyInitialization.registerLazyComponent('MLFacet', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./MLFacet'],
        () => {
          let loaded = require<IComponentDefinition>('./MLFacet.ts')['MLFacet'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('MLFacet', resolve),
        'MLFacet'
      );
    });
  });
}
