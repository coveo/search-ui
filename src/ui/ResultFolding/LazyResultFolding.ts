import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultFolding() {
  LazyInitialization.registerLazyComponent('ResultFolding', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ResultFolding'],
        () => {
          let loaded = require<IComponentDefinition>('./ResultFolding.ts')['ResultFolding'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ResultFolding', resolve),
        'ResultFolding'
      );
    });
  });
}
