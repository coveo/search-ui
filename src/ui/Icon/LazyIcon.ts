import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyIcon() {
  Initialization.registerLazyComponent('Icon', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Icon'], () => {
        let loaded = require<IComponentDefinition>('./Icon.ts')['Icon'];
        loaded.doExport();
        resolve(loaded);
      }, 'Icon');
    });
  });
}
