import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyShareQuery() {
  Initialization.registerLazyComponent('ShareQuery', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ShareQuery'], () => {
        let loaded = require<IComponentDefinition>('./ShareQuery.ts')['ShareQuery'];
        lazyExport(loaded, resolve);
      }, 'ShareQuery');
    });
  });
}
