import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyFacetSlider() {
  Initialization.registerLazyComponent('FacetSlider', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./FacetSlider'], () => {
        let loaded = require<IComponentDefinition>('./FacetSlider.ts')['FacetSliderModuleDefinition'];
        loaded.doExport();
        resolve(loaded);
      }, 'FacetSlider');
    });
  });
}
