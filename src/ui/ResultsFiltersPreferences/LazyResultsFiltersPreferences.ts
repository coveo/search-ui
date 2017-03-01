import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultsFiltersPreferences() {
  Initialization.registerLazyComponent('ResultsFiltersPreferences', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ResultsFiltersPreferences'], () => {
        let loaded = require<IComponentDefinition>('./ResultsFiltersPreferences.ts')['ResultsFiltersPreferences'];
        lazyExport(loaded, resolve);
      }, 'ResultsFiltersPreferences');
    });
  });
}
