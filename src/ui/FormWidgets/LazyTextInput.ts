import { LazyInitialization } from '../Base/Initialization';
import { lazyExportModule } from '../../GlobalExports';

export function lazyTextInput() {
  LazyInitialization.registerLazyModule('TextInput', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./TextInput'],
        () => {
          let loaded = require('./TextInput.ts')['TextInput'];
          lazyExportModule(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('TextInput', resolve),
        'TextInput'
      );
    });
  });
}
