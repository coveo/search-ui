import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultTagging() {
  Initialization.registerLazyComponent('ResultTagging', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./ResultTagging'], () => {
        let loaded = require<IComponentDefinition>('./ResultTagging.ts')['ResultTagging'];
        lazyExport(loaded, resolve);
      }, 'ResultTagging');
    });
  });
}
