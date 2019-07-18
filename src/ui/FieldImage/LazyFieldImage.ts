import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFieldImage() {
  LazyInitialization.registerLazyComponent('FieldImage', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./FieldImage'],
        () => {
          let loaded = require<IComponentDefinition>('./FieldImage.ts')['FieldImage'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('FieldImage', resolve),
        'FieldImage'
      );
    });
  });
}
