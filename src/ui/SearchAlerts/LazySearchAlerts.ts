import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazySearchAlerts() {
  Initialization.registerLazyComponent('SearchAlerts', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./SearchAlerts'], () => {
        let loaded = require<IComponentDefinition>('./SearchAlerts.ts')['SearchAlerts'];
        lazyExport(loaded, resolve);
      }, 'SearchAlerts');
    });
  });
}
