import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazySearchbox() {
  LazyInitialization.registerLazyComponent('Searchbox', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Searchbox'],
        () => {
          let loaded = require<IComponentDefinition>('./Searchbox.ts')['Searchbox'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Searchbox', resolve),
        'Searchbox'
      );
    });
  });
}
