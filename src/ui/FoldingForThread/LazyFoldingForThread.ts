import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFoldingForThread() {
  LazyInitialization.registerLazyComponent('FoldingForThread', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./FoldingForThread'],
        () => {
          let loaded = require<IComponentDefinition>('./FoldingForThread.ts')['FoldingForThread'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('FoldingForThread', resolve),
        'FoldingForThread'
      );
    });
  });
}
