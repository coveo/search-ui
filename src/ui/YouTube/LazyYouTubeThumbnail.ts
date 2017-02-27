import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { registerFields } from './YouTubeThumbnailFields';

export function lazyYouTubeThumbnail() {
  registerFields();
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
