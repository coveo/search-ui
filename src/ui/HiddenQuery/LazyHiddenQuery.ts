import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyHiddenQuery() {
  LazyInitialization.registerLazyComponent('HiddenQuery', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./HiddenQuery'],
        () => {
          let loaded = require<IComponentDefinition>('./HiddenQuery.ts')['HiddenQuery'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('HiddenQuery', resolve),
        'HiddenQuery'
      );
    });
  });
}
