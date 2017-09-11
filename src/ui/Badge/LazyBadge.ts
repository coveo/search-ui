import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyBadge() {
  LazyInitialization.registerLazyComponent('Badge', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Badge'],
        () => {
          let loaded = require<IComponentDefinition>('./Badge.ts')['Badge'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Badge', resolve),
        'Badge'
      );
    });
  });
}
