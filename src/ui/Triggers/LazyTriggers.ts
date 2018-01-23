import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyTriggers() {
  LazyInitialization.registerLazyComponent('Triggers', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Triggers'],
        () => {
          let loaded = require<IComponentDefinition>('./Triggers.ts')['Triggers'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Triggers', resolve),
        'Triggers'
      );
    });
  });
}
