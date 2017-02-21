import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazySearchButton() {
  Initialization.registerLazyComponent('SearchButton', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./SearchButton'], () => {
        let loaded = require<IComponentDefinition>('./SearchButton.ts')['SearchButton'];
        loaded.doExport();
        resolve(loaded);
      }, 'SearchButton');
    });
  });
}
