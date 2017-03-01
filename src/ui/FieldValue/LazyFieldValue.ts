import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFieldValue() {
  Initialization.registerLazyComponent('FieldValue', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./FieldValue'], () => {
        let loaded = require<IComponentDefinition>('./FieldValue.ts')['FieldValue'];
        lazyExport(loaded, resolve);
      }, 'FieldValue');
    });
  });
}
