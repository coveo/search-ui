import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFollowItem() {
  LazyInitialization.registerLazyComponent('FollowItem', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./FollowItem'],
        () => {
          let loaded = require<IComponentDefinition>('./FollowItem.ts')['FollowItem'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('FollowItem', resolve),
        'FollowItem'
      );
    });
  });
}
