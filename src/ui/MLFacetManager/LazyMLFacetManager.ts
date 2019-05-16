import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyMLFacetManager() {
  LazyInitialization.registerLazyComponent('MLFacetManager', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./MLFacetManager'],
        () => {
          let loaded = require<IComponentDefinition>('./MLFacetManager.ts')['MLFacetManager'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('MLFacetManager', resolve),
        'MLFacet'
      );
    });
  });
}
