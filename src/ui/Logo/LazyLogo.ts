import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyLogo() {
  Initialization.registerLazyComponent('Logo', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Logo'], () => {
        let loaded = require<IComponentDefinition>('./Logo.ts')['Logo'];
        lazyExport(loaded, resolve);
      }, 'Logo');
    });
  });
}
