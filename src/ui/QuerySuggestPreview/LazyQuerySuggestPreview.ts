import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyQuerySuggestPreview() {
  LazyInitialization.registerLazyComponent('QuerySuggestPreview', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./QuerySuggestPreview'],
        () => {
          let loaded = require<IComponentDefinition>('./QuerySuggestPreview.ts')['QuerySuggestPreview'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('QuerySuggestPreview', resolve),
        'QuerySuggestPreview'
      );
    });
  });
}
