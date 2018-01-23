import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyQuerySummary() {
  LazyInitialization.registerLazyComponent('QuerySummary', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./QuerySummary'],
        () => {
          let loaded = require<IComponentDefinition>('./QuerySummary.ts')['QuerySummary'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('QuerySummary', resolve),
        'QuerySummary'
      );
    });
  });
}
