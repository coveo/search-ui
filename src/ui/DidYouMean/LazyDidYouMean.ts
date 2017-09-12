import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyDidYouMean() {
  LazyInitialization.registerLazyComponent('DidYouMean', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./DidYouMean'],
        () => {
          let loaded = require<IComponentDefinition>('./DidYouMean.ts')['DidYouMean'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('DidYouMean', resolve),
        'DidYouMean'
      );
    });
  });
}
