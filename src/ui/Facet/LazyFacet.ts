import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyFacet() {
  Initialization.registerLazyComponent('Facet', ()=> {
    return new Promise((resolve, reject)=> {
      require.ensure(['./Facet'], ()=> {
        let loaded = require<IComponentDefinition>('./Facet.ts')['Facet'];
        loaded.doExport();
        resolve(loaded);
      }, 'Facet');
    });
  })
}
