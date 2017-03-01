import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyExportToExcel() {
  Initialization.registerLazyComponent('ExportToExcel', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ExportToExcel'], () => {
        let loaded = require<IComponentDefinition>('./ExportToExcel.ts')['ExportToExcel'];
        lazyExport(loaded, resolve);
      }, 'ExportToExcel');
    });
  });
}
