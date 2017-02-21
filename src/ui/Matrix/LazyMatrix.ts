import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyMatrix() {
  Initialization.registerLazyComponent('Matrix', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Matrix'], () => {
        let loaded = require<IComponentDefinition>('./Matrix.ts')['Matrix'];
        loaded.doExport();
        resolve(loaded);
      }, 'Matrix');
    });
  });
}
