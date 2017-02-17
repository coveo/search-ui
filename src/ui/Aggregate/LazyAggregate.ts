import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyAggregate() {
  Initialization.registerLazyComponent('Aggregate', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Aggregate'], () => {
        let loaded = require<IComponentDefinition>('./Aggregate.ts')['Aggregate'];
        loaded.doExport();
        resolve(loaded);
      }, 'Aggregate');
    });
  })
}
