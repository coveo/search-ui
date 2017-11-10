import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyFieldOccurenceSuggestions() {
  LazyInitialization.registerLazyComponent('FieldOccurenceSuggestions', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./FieldOccurenceSuggestions'],
        () => {
          let loaded = require<IComponentDefinition>('./FieldOccurenceSuggestions.ts')['FieldOccurenceSuggestions'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('FieldOccurenceSuggestions', resolve),
        'FieldOccurenceSuggestions'
      );
    });
  });
}
