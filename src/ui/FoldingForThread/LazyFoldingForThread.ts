import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFoldingForThread() {
  Initialization.registerLazyComponent('FoldingForThread', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./FoldingForThread'], () => {
        let loaded = require<IComponentDefinition>('./FoldingForThread.ts')['FoldingForThread'];
        lazyExport(loaded, resolve);
      }, 'FoldingForThread');
    });
  });
}
