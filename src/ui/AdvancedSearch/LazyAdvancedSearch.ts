import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyAdvancedSearch() {
  Initialization.registerLazyComponent('AdvancedSearch', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./AdvancedSearch'], () => {
        let loaded = require<IComponentDefinition>('./AdvancedSearch.ts')['AdvancedSearch'];
        loaded.doExport();
        resolve(loaded);
      }, 'AdvancedSearch');
    });
  });
}
