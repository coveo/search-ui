import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyBreadcrumb() {
  Initialization.registerLazyComponent('Breadcrumb', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Breadcrumb'], () => {
        let loaded = require<IComponentDefinition>('./Breadcrumb.ts')['Breadcrumb'];
        loaded.doExport();
        resolve(loaded);
      }, 'Breadcrumb');
    });
  });
}
