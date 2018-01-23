import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyLogo() {
  LazyInitialization.registerLazyComponent('Logo', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Logo'],
        () => {
          let loaded = require<IComponentDefinition>('./Logo.ts')['Logo'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Logo', resolve),
        'Logo'
      );
    });
  });
}
