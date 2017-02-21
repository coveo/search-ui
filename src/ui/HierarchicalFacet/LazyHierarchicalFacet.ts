import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyHierarchicalFacet() {
  Initialization.registerLazyComponent('HierarchicalFacet', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./HierarchicalFacet'], () => {
        let loaded = require<IComponentDefinition>('./HierarchicalFacet.ts')['HierarchicalFacet'];
        loaded.doExport();
        resolve(loaded);
      }, 'HierarchicalFacet');
    });
  });
}
