import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyDidYouMean() {
  Initialization.registerLazyComponent('DidYouMean', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./DidYouMean'], () => {
        let loaded = require<IComponentDefinition>('./DidYouMean.ts')['DidYouMean'];
        loaded.doExport();
        resolve(loaded);
      }, 'DidYouMean');
    });
  });
}
