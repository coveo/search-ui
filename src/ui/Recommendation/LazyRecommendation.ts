import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyRecommendation() {
  Initialization.registerLazyComponent('Recommendation', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Recommendation'], () => {
        let loaded = require<IComponentDefinition>('./Recommendation.ts')['Recommendation'];
        loaded.doExport();
        resolve(loaded);
      }, 'Recommendation');
    });
  });
}
