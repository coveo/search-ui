import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyMobileFacet() {
  LazyInitialization.registerLazyComponent('MobileFacet', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./MobileFacet'],
        () => {
          let loaded = require<IComponentDefinition>('./MobileFacet.ts')['MobileFacet'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('MobileFacet', resolve),
        'MobileFacet'
      );
    });
  });
}
