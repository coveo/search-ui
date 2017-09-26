import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';

export function lazyGoogleApiPositionProvider(): void {
  LazyInitialization.registerLazyComponent('GoogleApiPositionProvider', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./GoogleApiPositionProvider'],
        () => {
          const loaded = require<IComponentDefinition>('./GoogleApiPositionProvider.ts')['GoogleApiPositionProvider'];
          resolve(loaded);
        },
        LazyInitialization.buildErrorCallback('GoogleApiPositionProvider', resolve),
        'GoogleApiPositionProvider'
      );
    });
  });
}
