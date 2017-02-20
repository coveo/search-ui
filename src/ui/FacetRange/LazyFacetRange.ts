import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyFacet() {
  Initialization.registerLazyComponent('FacetRange', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./FacetRange'], () => {
        let loaded = require<IComponentDefinition>('./FacetRange.ts')['FacetRange'];
        loaded.doExport();
        resolve(loaded);
      }, 'FacetRange');
    });
  });
}
