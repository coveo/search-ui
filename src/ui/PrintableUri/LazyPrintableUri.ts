import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyPrintableUri() {
  LazyInitialization.registerLazyComponent('PrintableUri', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./PrintableUri'],
        () => {
          let loaded = require<IComponentDefinition>('./PrintableUri.ts')['PrintableUri'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('PrintableUri', resolve),
        'PrintableUri'
      );
    });
  });
}
