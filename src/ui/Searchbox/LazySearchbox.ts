import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazySearchbox() {
  Initialization.registerLazyComponent('Searchbox', ()=> {
    return new Promise((resolve, reject)=> {
      require.ensure(['./Searchbox'], ()=> {
        let loaded = require<IComponentDefinition>('./Searchbox.ts')['Searchbox'];
        if (Coveo['Searchbox'] == null) {
          Coveo['Searchbox'] = loaded
        }
        resolve(loaded);
      }, 'Searchbox');
    });
  })
}
