import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyFolding() {
  Initialization.registerLazyComponent('Folding', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Folding'], () => {
        let loaded = require<IComponentDefinition>('./Folding.ts')['Folding'];
        loaded.doExport();
        resolve(loaded);
      }, 'Folding');
    });
  });
}
