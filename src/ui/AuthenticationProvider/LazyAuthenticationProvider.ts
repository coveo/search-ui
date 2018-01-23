import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyAuthenticationProvider() {
  LazyInitialization.registerLazyComponent('AuthenticationProvider', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./AuthenticationProvider'],
        () => {
          let loaded = require<IComponentDefinition>('./AuthenticationProvider.ts')['AuthenticationProvider'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('AuthenticationProvider', resolve),
        'AuthenticationProvider'
      );
    });
  });
}
