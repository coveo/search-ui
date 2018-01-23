import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultsPreferences() {
  LazyInitialization.registerLazyComponent('ResultsPreferences', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ResultsPreferences'],
        () => {
          let loaded = require<IComponentDefinition>('./ResultsPreferences.ts')['ResultsPreferences'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ResultsPreferences', resolve),
        'ResultsPreferences'
      );
    });
  });
}
