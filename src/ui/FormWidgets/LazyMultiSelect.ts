import { LazyInitialization } from '../Base/Initialization';
import { lazyExportModule } from '../../GlobalExports';

export function lazyMultiSelect() {
  LazyInitialization.registerLazyModule('MultiSelect', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./MultiSelect'],
        () => {
          let loaded = require('./MultiSelect.ts')['MultiSelect'];
          lazyExportModule(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('MultiSelect', resolve),
        'MultiSelect'
      );
    });
  });
}
