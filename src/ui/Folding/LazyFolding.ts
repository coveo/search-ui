import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFolding() {
  LazyInitialization.registerLazyComponent('Folding', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Folding'],
        () => {
          let loaded = require<IComponentDefinition>('./Folding.ts')['Folding'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Folding', resolve),
        'Folding'
      );
    });
  });
}
