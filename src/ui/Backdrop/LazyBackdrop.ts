import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyBackdrop() {
  LazyInitialization.registerLazyComponent('Backdrop', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Backdrop'],
        () => {
          let loaded = require<IComponentDefinition>('./Backdrop.ts')['Backdrop'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Backdrop', resolve),
        'Backdrop'
      );
    });
  });
}
