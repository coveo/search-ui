import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyYouTubeThumbnail() {
  Initialization.registerLazyComponent('YouTubeThumbnail', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./YouTubeThumbnail'], () => {
        let loaded = require<IComponentDefinition>('./YouTubeThumbnail.ts')['YouTubeThumbnail'];
        loaded.doExport();
        resolve(loaded);
      }, 'YouTubeThumbnail');
    });
  });
}
