import { LazyInitialization } from '../Base/Initialization';
import { IComponentDefinition } from '../Base/Component';
import { lazyExport } from '../../GlobalExports';

export function lazyDebug(): void {
  LazyInitialization.registerLazyComponent('Debug', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Debug'],
        () => {
          const loaded = require<IComponentDefinition>('./Debug.ts')['Debug'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Debug', resolve),
        'Debug'
      );
    });
  });
}
