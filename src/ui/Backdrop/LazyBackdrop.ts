import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyBackdrop() {
  Initialization.registerLazyComponent('Backdrop', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Backdrop'], () => {
        let loaded = require<IComponentDefinition>('./Backdrop.ts')['Backdrop'];
        loaded.doExport();
        resolve(loaded);
      }, 'Backdrop');
    });
  });
}
