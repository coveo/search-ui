import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyQuerybox() {
  LazyInitialization.registerLazyComponent('Querybox', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Querybox'],
        () => {
          let loaded = require<IComponentDefinition>('./Querybox.ts')['Querybox'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Querybox', resolve),
        'Querybox'
      );
    });
  });
}
