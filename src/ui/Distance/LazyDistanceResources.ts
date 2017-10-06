import { LazyInitialization } from '../Base/Initialization';
import { IComponentDefinition } from '../Base/Component';
import { lazyExport } from '../../GlobalExports';

export function lazyDistanceResources(): void {
  LazyInitialization.registerLazyComponent('DistanceResources', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./DistanceResources'],
        () => {
          const loaded = require<IComponentDefinition>('./DistanceResources.ts')['DistanceResources'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('DistanceResources', resolve),
        'DistanceResources'
      );
    });
  });
}
