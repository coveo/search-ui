import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFolding() {
  Initialization.registerLazyComponent('Folding', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Folding'], () => {
        let loaded = require<IComponentDefinition>('./Folding.ts')['Folding'];
        lazyExport(loaded, resolve);
      }, 'Folding');
    });
  });
}
