import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyErrorReport() {
  Initialization.registerLazyComponent('ErrorReport', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ErrorReport'], () => {
        let loaded = require<IComponentDefinition>('./ErrorReport.ts')['ErrorReport'];
        loaded.doExport();
        resolve(loaded);
      }, 'ErrorReport');
    });
  });
}
