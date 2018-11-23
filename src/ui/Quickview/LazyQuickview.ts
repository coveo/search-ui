import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyQuickview() {
  LazyInitialization.registerLazyComponent('Quickview', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Quickview'],
        () => {
          let loaded = require<IComponentDefinition>('./Quickview.ts')['Quickview'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Quickview', resolve),
        'Quickview'
      );
    });
  });
}
