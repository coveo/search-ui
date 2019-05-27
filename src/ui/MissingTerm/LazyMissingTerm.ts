import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyMissingTerm() {
  LazyInitialization.registerLazyComponent('MissingTerm', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./MissingTerm'],
        () => {
          let loaded = require<IComponentDefinition>('./MissingTerm.ts')['MissingTerm'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('MissingTerm', resolve),
        'MissingTerm'
      );
    });
  });
}
