import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyIcon() {
  LazyInitialization.registerLazyComponent('Icon', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Icon'],
        () => {
          let loaded = require<IComponentDefinition>('./Icon.ts')['Icon'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Icon', resolve),
        'Icon'
      );
    });
  });
}
