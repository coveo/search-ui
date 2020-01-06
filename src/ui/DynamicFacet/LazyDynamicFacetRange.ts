import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyDynamicFacetRange() {
  LazyInitialization.registerLazyComponent('DynamicFacetRange', () => {
    return new Promise(resolve => {
      require.ensure(
        ['./DynamicFacetRange'],
        () => {
          let loaded = require<IComponentDefinition>('./DynamicFacetRange.ts')['DynamicFacetRange'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('DynamicFacetRange', resolve),
        'DynamicFacetRange'
      );
    });
  });
}
