import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyBreadcrumb() {
  LazyInitialization.registerLazyComponent('Breadcrumb', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Breadcrumb'],
        () => {
          let loaded = require<IComponentDefinition>('./Breadcrumb.ts')['Breadcrumb'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Breadcrumb', resolve),
        'Breadcrumb'
      );
    });
  });
}
