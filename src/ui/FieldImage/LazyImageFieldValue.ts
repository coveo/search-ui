import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyImageFieldValue() {
  LazyInitialization.registerLazyComponent('ImageFieldValue', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ImageFieldValue'],
        () => {
          let loaded = require<IComponentDefinition>('./ImageFieldValue.ts')['ImageFieldValue'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ImageFieldValue', resolve),
        'ImageFieldValue'
      );
    });
  });
}
