import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultList() {
  LazyInitialization.registerLazyComponent('ResultList', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ResultList'],
        () => {
          let loaded = require<IComponentDefinition>('./ResultList.ts')['ResultList'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ResultList', resolve),
        'ResultList'
      );
    });
  });
}
