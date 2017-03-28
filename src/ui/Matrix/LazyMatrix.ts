import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyMatrix() {
  Initialization.registerLazyComponent('Matrix', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Matrix'], () => {
        let loaded = require<IComponentDefinition>('./Matrix.ts')['Matrix'];
        lazyExport(loaded, resolve);
      }, 'Matrix');
    });
  });
}
