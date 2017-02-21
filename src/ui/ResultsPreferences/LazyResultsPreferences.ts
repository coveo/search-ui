import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyResultsPreferences() {
  Initialization.registerLazyComponent('ResultsPreferences', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ResultsPreferences'], () => {
        let loaded = require<IComponentDefinition>('./ResultsPreferences.ts')['ResultsPreferences'];
        loaded.doExport();
        resolve(loaded);
      }, 'ResultsPreferences');
    });
  });
}
