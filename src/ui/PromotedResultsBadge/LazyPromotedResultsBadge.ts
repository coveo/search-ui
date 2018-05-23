import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyPromotedResultsBadge() {
  LazyInitialization.registerLazyComponent('PromotedResultsBadge', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./PromotedResultsBadge'],
        () => {
          let loaded = require<IComponentDefinition>('./PromotedResultsBadge.ts')['PromotedResultsBadge'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('PromotedResultsBadge', resolve),
        'PromotedResultsBadge'
      );
    });
  });
}
