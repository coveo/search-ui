import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFacetSlider() {
  Initialization.registerLazyComponent('FacetSlider', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./FacetSlider'], () => {
        let loaded = require<IComponentDefinition>('./FacetSlider.ts')['FacetSlider'];
        lazyExport(loaded, resolve);
      }, 'FacetSlider');
    });
  });
}
