import { LazyInitialization } from '../Base/Initialization';
import { IComponentDefinition } from '../Base/Component';

export function lazyNavigatorPositionProvider(): void {
  LazyInitialization.registerLazyComponent('NavigatorPositionProvider', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./NavigatorPositionProvider'],
        () => {
          const loaded = require<IComponentDefinition>('./NavigatorPositionProvider.ts')['NavigatorPositionProvider'];
          resolve(loaded);
        },
        LazyInitialization.buildErrorCallback('NavigatorPositionProvider', resolve),
        'NavigatorPositionProvider'
      );
    });
  });
}
