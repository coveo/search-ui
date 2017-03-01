import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyHierarchicalFacet() {
  Initialization.registerLazyComponent('HierarchicalFacet', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./HierarchicalFacet', '../Facet/Facet'], () => {
        let loaded = require<IComponentDefinition>('./HierarchicalFacet.ts')['HierarchicalFacet'];
        lazyExport(loaded, resolve);
      }, 'HierarchicalFacet');
    });
  });
}
