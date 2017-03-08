import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyAdvancedSearch() {
  Initialization.registerLazyComponent('AdvancedSearch', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./AdvancedSearch'], () => {
        let loaded = require<IComponentDefinition>('./AdvancedSearch.ts')['AdvancedSearch'];
        lazyExport(loaded, resolve);
      }, 'AdvancedSearch');
    });
  });
}
