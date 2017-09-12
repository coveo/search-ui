import { LazyInitialization } from '../Base/Initialization';
import { lazyExportModule } from '../../GlobalExports';

export function lazyNumericSpinner() {
  LazyInitialization.registerLazyModule('NumericSpinner', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./NumericSpinner'],
        () => {
          let loaded = require('./NumericSpinner.ts')['NumericSpinner'];
          lazyExportModule(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('NumericSpinner', resolve),
        'NumericSpinner'
      );
    });
  });
}
