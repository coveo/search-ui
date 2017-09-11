import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazySearchAlerts() {
  LazyInitialization.registerLazyComponent('SearchAlerts', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./SearchAlerts'],
        () => {
          let loaded = require<IComponentDefinition>('./SearchAlerts.ts')['SearchAlerts'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('SearchAlerts', resolve),
        'SearchAlerts'
      );
    });
  });
}
