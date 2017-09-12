import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyThumbnail() {
  LazyInitialization.registerLazyComponent('Thumbnail', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Thumbnail'],
        () => {
          let loaded = require<IComponentDefinition>('./Thumbnail.ts')['Thumbnail'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Thumbnail', resolve),
        'Thumbnail'
      );
    });
  });
}
