import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultFolding() {
  Initialization.registerLazyComponent('ResultFolding', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ResultFolding'], () => {
        let loaded = require<IComponentDefinition>('./ResultFolding.ts')['ResultFolding'];
        lazyExport(loaded, resolve);
      }, 'ResultFolding');
    });
  });
}
