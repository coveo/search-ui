import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyPrintableUri() {
  Initialization.registerLazyComponent('PrintableUri', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./PrintableUri'], () => {
        let loaded = require<IComponentDefinition>('./PrintableUri.ts')['PrintableUri'];
        loaded.doExport();
        resolve(loaded);
      }, 'PrintableUri');
    });
  });
}
