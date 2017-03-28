import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultList() {
  Initialization.registerLazyComponent('ResultList', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ResultList'], () => {
        let loaded = require<IComponentDefinition>('./ResultList.ts')['ResultList'];
        lazyExport(loaded, resolve);
      }, 'ResultList');
    });
  });
}
