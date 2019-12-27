import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyCommerceQuery() {
  LazyInitialization.registerLazyComponent('CommerceQuery', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./CommerceQuery'],
        () => {
          let loaded = require<IComponentDefinition>('./CommerceQuery.ts')['CommerceQuery'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('CommerceQuery', resolve),
        'CommerceQuery'
      );
    });
  });
}
