import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyChatterTopic() {
  Initialization.registerLazyComponent('ChatterTopic', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ChatterTopic'], () => {
        let loaded = require<IComponentDefinition>('./ChatterTopic.ts')['ChatterTopic'];
        lazyExport(loaded, resolve);
      }, 'ChatterTopic');
    });
  });
}
