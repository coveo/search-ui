import { LazyInitialization } from '../Base/Initialization';
import { lazyExportModule } from '../../GlobalExports';

export function lazyDatePicker() {
  LazyInitialization.registerLazyModule('Datepicker', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./DatePicker'],
        () => {
          let loaded = require('./DatePicker.ts')['DatePicker'];
          lazyExportModule(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('DatePicker', resolve),
        'DatePicker'
      );
    });
  });
}
