import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyCardOverlay() {
  Initialization.registerLazyComponent('CardOverlay', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./CardOverlay'], () => {
        let loaded = require<IComponentDefinition>('./CardOverlay.ts')['CardOverlay'];
        loaded.doExport();
        resolve(loaded);
      }, 'CardOverlay');
    });
  });
}
