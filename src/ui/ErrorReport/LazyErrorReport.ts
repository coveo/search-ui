import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyErrorReport() {
  LazyInitialization.registerLazyComponent('ErrorReport', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ErrorReport'],
        () => {
          let loaded = require<IComponentDefinition>('./ErrorReport.ts')['ErrorReport'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ErrorReport', resolve),
        'ErrorReport'
      );
    });
  });
}
