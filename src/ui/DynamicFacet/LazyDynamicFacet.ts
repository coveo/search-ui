import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyDynamicFacet() {
  LazyInitialization.registerLazyComponent('DynamicFacet', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./DynamicFacet'],
        () => {
          let loaded = require<IComponentDefinition>('./DynamicFacet.ts')['DynamicFacet'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('DynamicFacet', resolve),
        'DynamicFacet'
      );
    });
  });
}
