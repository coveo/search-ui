import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultsPerPage() {
  Initialization.registerLazyComponent('ResultsPerPage', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ResultsPerPage'], () => {
        let loaded = require<IComponentDefinition>('./ResultsPerPage.ts')['ResultsPerPage'];
        lazyExport(loaded, resolve);
      }, 'ResultsPerPage');
    });
  });
}
