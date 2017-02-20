import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyAuthenticationProvider() {
  Initialization.registerLazyComponent('AuthenticationProvider', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./AuthenticationProvider'], () => {
        let loaded = require<IComponentDefinition>('./AuthenticationProvider.ts')['AuthenticationProvider'];
        loaded.doExport();
        resolve(loaded);
      }, 'AuthenticationProvider');
    });
  });
}
