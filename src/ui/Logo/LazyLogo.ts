import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyLogo() {
  Initialization.registerLazyComponent('Logo', ()=> {
    return new Promise((resolve, reject)=> {
      require.ensure(['./Logo'], ()=> {
        let loaded = require<IComponentDefinition>('./Logo.ts')['Logo'];
        if (Coveo['Logo'] == null) {
          Coveo['Logo'] = loaded
        }
        resolve(loaded);
      }, 'Logo');
    });
  })
}
