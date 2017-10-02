import { LazyInitialization } from '../Base/Initialization';
import { lazyExportModule } from '../../GlobalExports';

export function lazyCheckbox() {
  LazyInitialization.registerLazyModule('Checkbox', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Checkbox'],
        () => {
          let loaded = require('./Checkbox.ts')['Checkbox'];
          lazyExportModule(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Checkbox', resolve),
        'Checkbox'
      );
    });
  });
}
