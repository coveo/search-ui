import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyCardActionBar() {
  LazyInitialization.registerLazyComponent('CardActionBar', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./CardActionBar'],
        () => {
          let loaded = require<IComponentDefinition>('./CardActionBar.ts')['CardActionBar'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('CardActionBar', resolve),
        'CardActionBar'
      );
    });
  });
}
