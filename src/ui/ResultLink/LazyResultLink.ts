import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultLink() {
  LazyInitialization.registerLazyComponent('ResultLink', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ResultLink'],
        () => {
          let loaded = require<IComponentDefinition>('./ResultLink.ts')['ResultLink'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ResultLink', resolve),
        'ResultLink'
      );
    });
  });
}
