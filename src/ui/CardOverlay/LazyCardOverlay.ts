import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyCardOverlay() {
  LazyInitialization.registerLazyComponent('CardOverlay', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./CardOverlay'],
        () => {
          let loaded = require<IComponentDefinition>('./CardOverlay.ts')['CardOverlay'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('CardOverlay', resolve),
        'CardOverlay'
      );
    });
  });
}
