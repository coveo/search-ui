import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultsPreferences() {
  Initialization.registerLazyComponent('ResultsPreferences', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ResultsPreferences'], () => {
        let loaded = require<IComponentDefinition>('./ResultsPreferences.ts')['ResultsPreferences'];
        lazyExport(loaded, resolve);
      }, 'ResultsPreferences');
    });
  });
}
