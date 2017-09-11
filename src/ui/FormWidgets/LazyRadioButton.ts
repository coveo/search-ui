import { LazyInitialization } from '../Base/Initialization';
import { lazyExportModule } from '../../GlobalExports';

export function lazyRadioButton() {
  LazyInitialization.registerLazyModule('RadioButton', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./RadioButton'],
        () => {
          let loaded = require('./RadioButton.ts')['RadioButton'];
          lazyExportModule(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('RadioButton', resolve),
        'RadioButton'
      );
    });
  });
}
