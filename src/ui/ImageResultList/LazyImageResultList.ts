import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyImageResultList() {
  Initialization.registerLazyComponent('ImageResultList', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ImageResultList'], () => {
        let loaded = require<IComponentDefinition>('./ImageResultList.ts')['ImageResultList'];
        loaded.doExport();
        resolve(loaded);
      }, 'ImageResultList');
    });
  });
}
