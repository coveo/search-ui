import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyExportToExcel() {
  LazyInitialization.registerLazyComponent('ExportToExcel', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ExportToExcel'],
        () => {
          let loaded = require<IComponentDefinition>('./ExportToExcel.ts')['ExportToExcel'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ExportToExcel', resolve),
        'ExportToExcel'
      );
    });
  });
}
