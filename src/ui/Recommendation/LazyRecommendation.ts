import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyRecommendation() {
  LazyInitialization.registerLazyComponent('Recommendation', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Recommendation'],
        () => {
          let loaded = require<IComponentDefinition>('./Recommendation.ts')['Recommendation'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Recommendation', resolve),
        'Recommendation'
      );
    });
  });
}
