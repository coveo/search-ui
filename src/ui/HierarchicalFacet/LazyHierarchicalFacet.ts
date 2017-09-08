import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyHierarchicalFacet() {
  LazyInitialization.registerLazyComponent('HierarchicalFacet', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./HierarchicalFacet', '../Facet/Facet'],
        () => {
          let loaded = require<IComponentDefinition>('./HierarchicalFacet.ts')['HierarchicalFacet'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('HierarchicalFacet', resolve),
        'HierarchicalFacet'
      );
    });
  });
}
