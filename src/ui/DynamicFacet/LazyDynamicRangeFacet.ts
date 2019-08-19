import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyDynamicRangeFacet() {
  LazyInitialization.registerLazyComponent('DynamicRangeFacet', () => {
    return new Promise(resolve => {
      require.ensure(
        ['./DynamicRangeFacet'],
        () => {
          let loaded = require<IComponentDefinition>('./DynamicRangeFacet.ts')['DynamicRangeFacet'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('DynamicRangeFacet', resolve),
        'DynamicRangeFacet'
      );
    });
  });
}
