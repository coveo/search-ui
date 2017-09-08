import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFacetSlider() {
  LazyInitialization.registerLazyComponent('FacetSlider', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./FacetSlider'],
        () => {
          let loaded = require<IComponentDefinition>('./FacetSlider.ts')['FacetSlider'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('FacetSlider', resolve),
        'FacetSlider'
      );
    });
  });
}
