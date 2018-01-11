import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyTimespanFacet() {
  LazyInitialization.registerLazyComponent('TimespanFacet', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./TimespanFacet'],
        () => {
          let loaded = require<IComponentDefinition>('./TimespanFacet.ts')['TimespanFacet'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('TimespanFacet', resolve),
        'TimespanFacet'
      );
    });
  });
}
