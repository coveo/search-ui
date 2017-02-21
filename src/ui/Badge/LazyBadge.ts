import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyBadge() {
  Initialization.registerLazyComponent('Badge', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Badge'], () => {
        let loaded = require<IComponentDefinition>('./Badge.ts')['Badge'];
        loaded.doExport();
        resolve(loaded);
      }, 'Badge');
    });
  });
}
