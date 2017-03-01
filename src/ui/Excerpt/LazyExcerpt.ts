import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyExcerpt() {
  Initialization.registerLazyComponent('Excerpt', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Excerpt'], () => {
        let loaded = require<IComponentDefinition>('./Excerpt.ts')['Excerpt'];
        lazyExport(loaded, resolve);
      }, 'Excerpt');
    });
  });
}
