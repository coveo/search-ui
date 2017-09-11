import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFieldTable() {
  LazyInitialization.registerLazyComponent('FieldTable', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./FieldTable'],
        () => {
          let loaded = require<IComponentDefinition>('./FieldTable.ts')['FieldTable'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('FieldTable', resolve),
        'FieldTable'
      );
    });
  });
}
