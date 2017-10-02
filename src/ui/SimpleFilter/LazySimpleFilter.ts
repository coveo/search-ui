import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazySimpleFilter() {
  LazyInitialization.registerLazyComponent('SimpleFilter', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./SimpleFilter'],
        () => {
          let loaded = require<IComponentDefinition>('./SimpleFilter.ts')['SimpleFilter'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('SimpleFilter', resolve),
        'SimpleFilter'
      );
    });
  });
}
