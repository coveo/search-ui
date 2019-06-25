import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyMissingTerms() {
  LazyInitialization.registerLazyComponent('MissingTerms', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./MissingTerms'],
        () => {
          let loaded = require<IComponentDefinition>('./MissingTerms.ts')['MissingTerms'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('MissingTerms', resolve),
        'MissingTerms'
      );
    });
  });
}
