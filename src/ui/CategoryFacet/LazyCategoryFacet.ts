import { LazyInitialization } from '../Base/Initialization';
import { IComponentDefinition } from '../Base/Component';
import { lazyExport } from '../../GlobalExports';

export function lazyCategoryFacet() {
  LazyInitialization.registerLazyComponent('CategoryFacet', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./CategoryFacet'],
        () => {
          const loaded = require<IComponentDefinition>('./CategoryFacet.ts')['CategoryFacet'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('CategoryFacet', resolve),
        'CategoryFacet'
      );
    });
  });
}
