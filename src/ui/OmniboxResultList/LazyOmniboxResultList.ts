import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyOmniboxResultList() {
  Initialization.registerLazyComponent('OmniboxResultList', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./OmniboxResultList'], () => {
        let loaded = require<IComponentDefinition>('./OmniboxResultList.ts')['OmniboxResultList'];
        loaded.doExport();
        resolve(loaded);
      }, 'OmniboxResultList');
    });
  });
}
