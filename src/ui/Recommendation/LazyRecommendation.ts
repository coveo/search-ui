import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyRecommendation() {
  Initialization.registerLazyComponent('Recommendation', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Recommendation'], () => {
        let loaded = require<IComponentDefinition>('./Recommendation.ts')['Recommendation'];
        lazyExport(loaded, resolve);
      }, 'Recommendation');
    });
  });
}
