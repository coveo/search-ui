import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFieldSuggestions() {
  Initialization.registerLazyComponent('FieldSuggestions', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./FieldSuggestions'], () => {
        let loaded = require<IComponentDefinition>('./FieldSuggestions.ts')['FieldSuggestions'];
        lazyExport(loaded, resolve);
      }, 'FieldSuggestions');
    });
  });
}
