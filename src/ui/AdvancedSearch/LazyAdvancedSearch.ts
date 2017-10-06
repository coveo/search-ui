import { IComponentDefinition } from '../Base/Component';
import { lazyExport } from '../../GlobalExports';
import { LazyInitialization } from '../Base/Initialization';

export function lazyAdvancedSearch() {
  LazyInitialization.registerLazyComponent('AdvancedSearch', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./AdvancedSearch'],
        () => {
          let loaded = require<IComponentDefinition>('./AdvancedSearch.ts')['AdvancedSearch'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('AdvancedSearch', resolve),
        'AdvancedSearch'
      );
    });
  });
}
