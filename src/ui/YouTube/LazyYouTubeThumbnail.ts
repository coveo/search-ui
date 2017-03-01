import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { registerFields } from './YouTubeThumbnailFields';
import { lazyExport } from '../../GlobalExports';

export function lazyYouTubeThumbnail() {
  registerFields();
  Initialization.registerLazyComponent('YouTubeThumbnail', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./YouTubeThumbnail'], () => {
        let loaded = require<IComponentDefinition>('./YouTubeThumbnail.ts')['YouTubeThumbnail'];
        lazyExport(loaded, resolve);
      }, 'YouTubeThumbnail');
    });
  });
}
