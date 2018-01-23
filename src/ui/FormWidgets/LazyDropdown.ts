import { LazyInitialization } from '../Base/Initialization';
import { lazyExportModule } from '../../GlobalExports';

export function lazyDropdown() {
  LazyInitialization.registerLazyModule('Dropdown', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Dropdown'],
        () => {
          let loaded = require('./Dropdown.ts')['Dropdown'];
          lazyExportModule(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Dropdown', resolve),
        'Dropdown'
      );
    });
  });
}
