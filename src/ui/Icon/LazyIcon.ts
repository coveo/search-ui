import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyIcon() {
  Initialization.registerLazyComponent('Icon', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Icon'], () => {
        let loaded = require<IComponentDefinition>('./Icon.ts')['Icon'];
        lazyExport(loaded, resolve);
      }, 'Icon');
    });
  });
}
