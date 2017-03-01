import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyText() {
  Initialization.registerLazyComponent('Text', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Text'], () => {
        let loaded = require<IComponentDefinition>('./Text.ts')['Text'];
        lazyExport(loaded, resolve);
      }, 'Text');
    });
  });
}
