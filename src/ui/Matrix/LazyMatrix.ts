import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyMatrix() {
  LazyInitialization.registerLazyComponent('Matrix', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Matrix'],
        () => {
          let loaded = require<IComponentDefinition>('./Matrix.ts')['Matrix'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Matrix', resolve),
        'Matrix'
      );
    });
  });
}
