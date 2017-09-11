import { IComponentDefinition } from '../Base/Component';
import { lazyExport } from '../../GlobalExports';
import { LazyInitialization } from '../Base/Initialization';

export function lazyAggregate() {
  LazyInitialization.registerLazyComponent('Aggregate', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Aggregate'],
        () => {
          let loaded = require<IComponentDefinition>('./Aggregate.ts')['Aggregate'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Aggregate', resolve),
        'Aggregate'
      );
    });
  });
}
