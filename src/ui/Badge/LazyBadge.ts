import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyBadge() {
  Initialization.registerLazyComponent('Badge', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Badge'], () => {
        let loaded = require<IComponentDefinition>('./Badge.ts')['Badge'];
        lazyExport(loaded, resolve);
      }, 'Badge');
    });
  });
}
