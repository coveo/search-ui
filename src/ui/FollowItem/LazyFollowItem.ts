import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFollowItem() {
  Initialization.registerLazyComponent('FollowItem', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./FollowItem'], () => {
        let loaded = require<IComponentDefinition>('./FollowItem.ts')['FollowItem'];
        lazyExport(loaded, resolve);
      }, 'FollowItem');
    });
  });
}
