import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFieldValue() {
  LazyInitialization.registerLazyComponent('FieldValue', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./FieldValue'],
        () => {
          let loaded = require<IComponentDefinition>('./FieldValue.ts')['FieldValue'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('FieldValue', resolve),
        'FieldValue'
      );
    });
  });
}
