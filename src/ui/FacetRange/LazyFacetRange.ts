import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFacetRange() {
  Initialization.registerLazyComponent('FacetRange', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./FacetRange'], () => {
        let loaded = require<IComponentDefinition>('./FacetRange.ts')['FacetRange'];
        lazyExport(loaded, resolve);
      }, 'FacetRange');
    });
  });
}
