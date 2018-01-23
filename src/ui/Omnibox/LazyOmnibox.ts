import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyOmnibox() {
  LazyInitialization.registerLazyComponent('Omnibox', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Omnibox'],
        () => {
          let loaded = require<IComponentDefinition>('./Omnibox.ts')['Omnibox'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Omnibox', resolve),
        'Omnibox'
      );
    });
  });
}
