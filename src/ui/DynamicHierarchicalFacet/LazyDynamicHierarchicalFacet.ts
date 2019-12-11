import { LazyInitialization } from '../Base/Initialization';
import { IComponentDefinition } from '../Base/Component';
import { lazyExport } from '../../GlobalExports';

export function lazyDynamicHierarchicalFacet() {
  LazyInitialization.registerLazyComponent('DynamicHierarchicalFacet', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./DynamicHierarchicalFacet'],
        () => {
          const loaded = require<IComponentDefinition>('./DynamicHierarchicalFacet.ts')['DynamicHierarchicalFacet'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('DynamicHierarchicalFacet', resolve),
        'DynamicHierarchicalFacet'
      );
    });
  });
}
