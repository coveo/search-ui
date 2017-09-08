import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFacetRange() {
  LazyInitialization.registerLazyComponent('FacetRange', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./FacetRange'],
        () => {
          let loaded = require<IComponentDefinition>('./FacetRange.ts')['FacetRange'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('FacetRange', resolve),
        'FacetRange'
      );
    });
  });
}
