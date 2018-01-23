import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyChatterTopic() {
  LazyInitialization.registerLazyComponent('ChatterTopic', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ChatterTopic'],
        () => {
          let loaded = require<IComponentDefinition>('./ChatterTopic.ts')['ChatterTopic'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ChatterTopic', resolve),
        'ChatterTopic'
      );
    });
  });
}
