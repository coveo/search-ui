import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyShareQuery() {
  LazyInitialization.registerLazyComponent('ShareQuery', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ShareQuery'],
        () => {
          let loaded = require<IComponentDefinition>('./ShareQuery.ts')['ShareQuery'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ShareQuery', resolve),
        'ShareQuery'
      );
    });
  });
}
