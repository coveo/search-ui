import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyMicrophoneButton() {
  LazyInitialization.registerLazyComponent('MicrophoneButton', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./MicrophoneButton'],
        () => {
          let loaded = require<IComponentDefinition>('./MicrophoneButton.ts')['MicrophoneButton'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('MicrophoneButton', resolve),
        'MicrophoneButton'
      );
    });
  });
}
