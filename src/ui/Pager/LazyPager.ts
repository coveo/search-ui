import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyPager() {
  Initialization.registerLazyComponent('Pager', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Pager'], () => {
        let loaded = require<IComponentDefinition>('./Pager.ts')['Pager'];
        loaded.doExport();
        resolve(loaded);
      }, 'Pager');
    });
  });
}
