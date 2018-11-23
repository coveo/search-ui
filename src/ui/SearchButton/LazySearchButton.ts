import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazySearchButton() {
  LazyInitialization.registerLazyComponent('SearchButton', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./SearchButton'],
        () => {
          let loaded = require<IComponentDefinition>('./SearchButton.ts')['SearchButton'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('SearchButton', resolve),
        'SearchButton'
      );
    });
  });
}
