import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyChatterPostAttachment() {
  Initialization.registerLazyComponent('ChatterPostAttachment', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ChatterPostAttachment'], () => {
        let loaded = require<IComponentDefinition>('./ChatterPostAttachment.ts')['ChatterPostAttachment'];
        loaded.doExport();
        resolve(loaded);
      }, 'ChatterPostAttachment');
    });
  });
}
