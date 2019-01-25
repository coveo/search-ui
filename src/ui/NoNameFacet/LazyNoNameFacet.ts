import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyNoNameFacet() {
  LazyInitialization.registerLazyComponent('NoNameFacet', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./NoNameFacet'],
        () => {
          let loaded = require<IComponentDefinition>('./NoNameFacet.ts')['NoNameFacet'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('NoNameFacet', resolve),
        'NoNameFacet'
      );
    });
  });
}
