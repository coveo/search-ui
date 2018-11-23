import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFieldSuggestions() {
  LazyInitialization.registerLazyComponent('FieldSuggestions', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./FieldSuggestions'],
        () => {
          let loaded = require<IComponentDefinition>('./FieldSuggestions.ts')['FieldSuggestions'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('FieldSuggestions', resolve),
        'FieldSuggestions'
      );
    });
  });
}
