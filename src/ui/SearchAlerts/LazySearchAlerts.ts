import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazySearchAlerts() {
  Initialization.registerLazyComponent('SearchAlerts', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./SearchAlerts'], () => {
        let loaded = require<IComponentDefinition>('./SearchAlerts.ts')['SearchAlerts'];
        loaded.doExport();
        resolve(loaded);
      }, 'SearchAlerts');
    });
  });
}
