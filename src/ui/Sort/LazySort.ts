import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazySort() {
  LazyInitialization.registerLazyComponent('Sort', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Sort'],
        () => {
          let loaded = require<IComponentDefinition>('./Sort.ts')['Sort'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Sort', resolve),
        'Sort'
      );
    });
  });
}
