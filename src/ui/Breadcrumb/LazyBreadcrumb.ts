import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyBreadcrumb() {
  Initialization.registerLazyComponent('Breadcrumb', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Breadcrumb'], () => {
        let loaded = require<IComponentDefinition>('./Breadcrumb.ts')['Breadcrumb'];
        lazyExport(loaded, resolve);
      }, 'Breadcrumb');
    });
  });
}
