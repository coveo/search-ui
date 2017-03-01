import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyDidYouMean() {
  Initialization.registerLazyComponent('DidYouMean', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./DidYouMean'], () => {
        let loaded = require<IComponentDefinition>('./DidYouMean.ts')['DidYouMean'];
        lazyExport(loaded, resolve);
      }, 'DidYouMean');
    });
  });
}
