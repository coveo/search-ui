import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { registerFields } from './YouTubeThumbnailFields';
import { lazyExport } from '../../GlobalExports';

export function lazyYouTubeThumbnail() {
  registerFields();
  LazyInitialization.registerLazyComponent('YouTubeThumbnail', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./YouTubeThumbnail'],
        () => {
          let loaded = require<IComponentDefinition>('./YouTubeThumbnail.ts')['YouTubeThumbnail'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('YouTubeThumbnail', resolve),
        'YouTubeThumbnail'
      );
    });
  });
}
