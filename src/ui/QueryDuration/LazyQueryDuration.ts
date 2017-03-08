import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyQueryDuration() {
  Initialization.registerLazyComponent('QueryDuration', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./QueryDuration'], () => {
        let loaded = require<IComponentDefinition>('./QueryDuration.ts')['QueryDuration'];
        lazyExport(loaded, resolve);
      }, 'QueryDuration');
    });
  });
}
