import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyDynamicFacetManager() {
  LazyInitialization.registerLazyComponent('DynamicFacetManager', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./DynamicFacetManager'],
        () => {
          let loaded = require<IComponentDefinition>('./DynamicFacetManager.ts')['DynamicFacetManager'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('DynamicFacetManager', resolve),
        'DynamicFacet'
      );
    });
  });
}
