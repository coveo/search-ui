import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFacetsMobileMode() {
  LazyInitialization.registerLazyComponent('FacetsMobileMode', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./FacetsMobileMode'],
        () => {
          let loaded = require<IComponentDefinition>('./FacetsMobileMode.ts')['FacetsMobileMode'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('FacetsMobileMode', resolve),
        'FacetsMobileMode'
      );
    });
  });
}
