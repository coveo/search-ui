import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyThumbnail() {
  Initialization.registerLazyComponent('Thumbnail', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Thumbnail'], () => {
        let loaded = require<IComponentDefinition>('./Thumbnail.ts')['Thumbnail'];
        lazyExport(loaded, resolve);
      }, 'Thumbnail');
    });
  });
}
