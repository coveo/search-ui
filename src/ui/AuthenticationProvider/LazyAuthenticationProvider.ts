import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyAuthenticationProvider() {
  Initialization.registerLazyComponent('AuthenticationProvider', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./AuthenticationProvider'], () => {
        let loaded = require<IComponentDefinition>('./AuthenticationProvider.ts')['AuthenticationProvider'];
        lazyExport(loaded, resolve);
      }, 'AuthenticationProvider');
    });
  });
}
