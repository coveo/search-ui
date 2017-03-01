import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazySearchbox() {
  Initialization.registerLazyComponent('Searchbox', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Searchbox'], () => {
        let loaded = require<IComponentDefinition>('./Searchbox.ts')['Searchbox'];
        lazyExport(loaded, resolve);
      }, 'Searchbox');
    });
  });
}
