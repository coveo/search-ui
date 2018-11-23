import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFacetValueSuggestions() {
  LazyInitialization.registerLazyComponent('FacetValueSuggestions', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./FacetValueSuggestions'],
        () => {
          let loaded = require<IComponentDefinition>('./FacetValueSuggestions.ts')['FacetValueSuggestions'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('FacetValueSuggestions', resolve),
        'FacetValueSuggestions'
      );
    });
  });
}
