import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyChatterPostAttachment() {
  Initialization.registerLazyComponent('ChatterPostAttachment', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ChatterPostAttachment'], () => {
        let loaded = require<IComponentDefinition>('./ChatterPostAttachment.ts')['ChatterPostAttachment'];
        lazyExport(loaded, resolve);
      }, 'ChatterPostAttachment');
    });
  });
}
