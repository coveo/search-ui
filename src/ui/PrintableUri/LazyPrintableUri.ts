import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyPrintableUri() {
  Initialization.registerLazyComponent('PrintableUri', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./PrintableUri'], () => {
        let loaded = require<IComponentDefinition>('./PrintableUri.ts')['PrintableUri'];
        lazyExport(loaded, resolve);
      }, 'PrintableUri');
    });
  });
}
