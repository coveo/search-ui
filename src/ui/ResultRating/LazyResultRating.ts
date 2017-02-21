import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyResultRating() {
  Initialization.registerLazyComponent('ResultRating', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ResultRating'], () => {
        let loaded = require<IComponentDefinition>('./ResultRating.ts')['ResultRating'];
        loaded.doExport();
        resolve(loaded);
      }, 'ResultRating');
    });
  });
}
