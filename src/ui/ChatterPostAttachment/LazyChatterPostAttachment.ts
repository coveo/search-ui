import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyChatterPostAttachment() {
  LazyInitialization.registerLazyComponent('ChatterPostAttachment', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ChatterPostAttachment'],
        () => {
          let loaded = require<IComponentDefinition>('./ChatterPostAttachment.ts')['ChatterPostAttachment'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ChatterPostAttachment', resolve),
        'ChatterPostAttachment'
      );
    });
  });
}
