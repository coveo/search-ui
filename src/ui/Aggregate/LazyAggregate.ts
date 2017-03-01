import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyAggregate() {
  Initialization.registerLazyComponent('Aggregate', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Aggregate'], () => {
        let loaded = require<IComponentDefinition>('./Aggregate.ts')['Aggregate'];
        lazyExport(loaded, resolve);
      }, 'Aggregate');
    });
  });
}
