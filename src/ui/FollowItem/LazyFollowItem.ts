import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyFollowItem() {
  Initialization.registerLazyComponent('FollowItem', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./FollowItem'], () => {
        let loaded = require<IComponentDefinition>('./FollowItem.ts')['FollowItem'];
        loaded.doExport();
        resolve(loaded);
      }, 'FollowItem');
    });
  });
}
