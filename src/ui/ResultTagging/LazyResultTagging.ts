import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultTagging() {
  LazyInitialization.registerLazyComponent('ResultTagging', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ResultTagging'],
        () => {
          let loaded = require<IComponentDefinition>('./ResultTagging.ts')['ResultTagging'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ResultTagging', resolve),
        'ResultTagging'
      );
    });
  });
}
