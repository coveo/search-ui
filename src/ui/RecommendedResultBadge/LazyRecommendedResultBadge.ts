import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyRecommendedResultBadge() {
  LazyInitialization.registerLazyComponent('RecommendedResultBadge', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./RecommendedResultBadge'],
        () => {
          let loaded = require<IComponentDefinition>('./RecommendedResultBadge.ts')['RecommendedResultBadge'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('RecommendedResultBadge', resolve),
        'RecommendedResultBadge'
      );
    });
  });
}
