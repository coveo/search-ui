import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyExportToExcel() {
  Initialization.registerLazyComponent('ExportToExcel', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ExportToExcel'], () => {
        let loaded = require<IComponentDefinition>('./ExportToExcel.ts')['ExportToExcel'];
        loaded.doExport();
        resolve(loaded);
      }, 'ExportToExcel');
    });
  });
}
