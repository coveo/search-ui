import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultsFiltersPreferences() {
  LazyInitialization.registerLazyComponent('ResultsFiltersPreferences', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ResultsFiltersPreferences'],
        () => {
          let loaded = require<IComponentDefinition>('./ResultsFiltersPreferences.ts')['ResultsFiltersPreferences'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ResultsFiltersPreferences', resolve),
        'ResultsFiltersPreferences'
      );
    });
  });
}
