import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultsPerPage() {
  LazyInitialization.registerLazyComponent('ResultsPerPage', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ResultsPerPage'],
        () => {
          let loaded = require<IComponentDefinition>('./ResultsPerPage.ts')['ResultsPerPage'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ResultsPerPage', resolve),
        'ResultsPerPage'
      );
    });
  });
}
