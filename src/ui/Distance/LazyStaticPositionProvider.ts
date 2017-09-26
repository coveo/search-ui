import { LazyInitialization } from '../Base/Initialization';
import { IComponentDefinition } from '../Base/Component';

export function lazyStaticPositionProvider(): void {
  LazyInitialization.registerLazyComponent('StaticPositionProvider', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./StaticPositionProvider'],
        () => {
          const loaded = require<IComponentDefinition>('./StaticPositionProvider.ts')['StaticPositionProvider'];
          resolve(loaded);
        },
        LazyInitialization.buildErrorCallback('StaticPositionProvider', resolve),
        'StaticPositionProvider'
      );
    });
  });
}
