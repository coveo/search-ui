import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyText() {
  LazyInitialization.registerLazyComponent('Text', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./Text'],
        () => {
          let loaded = require<IComponentDefinition>('./Text.ts')['Text'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('Text', resolve),
        'Text'
      );
    });
  });
}
