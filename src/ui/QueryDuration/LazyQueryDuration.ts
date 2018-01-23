import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyQueryDuration() {
  LazyInitialization.registerLazyComponent('QueryDuration', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./QueryDuration'],
        () => {
          let loaded = require<IComponentDefinition>('./QueryDuration.ts')['QueryDuration'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('QueryDuration', resolve),
        'QueryDuration'
      );
    });
  });
}
