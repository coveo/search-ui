import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyPager() {
  LazyInitialization.registerLazyComponent('Pager', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Pager'],
        () => {
          let loaded = require<IComponentDefinition>('./Pager.ts')['Pager'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Pager', resolve),
        'Pager'
      );
    });
  });
}
