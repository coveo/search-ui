import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyLogo() {
  Initialization.registerLazyComponent('Logo', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Logo'], () => {
        let loaded = require<IComponentDefinition>('./Logo.ts')['Logo'];
        loaded.doExport();
        resolve(loaded);
      }, 'Logo');
    });
  });
}
