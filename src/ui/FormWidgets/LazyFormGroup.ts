import { LazyInitialization } from '../Base/Initialization';
import { lazyExportModule } from '../../GlobalExports';

export function lazyFormGroup() {
  LazyInitialization.registerLazyModule('FormGroup', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./FormGroup'],
        () => {
          let loaded = require('./FormGroup.ts')['FormGroup'];
          lazyExportModule(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('FormGroup', resolve),
        'FormGroup'
      );
    });
  });
}
