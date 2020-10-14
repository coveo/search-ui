import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazySmartSnippetSuggestions() {
  LazyInitialization.registerLazyComponent('SmartSnippetSuggestions', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./SmartSnippetSuggestions'],
        () => {
          let loaded = require<IComponentDefinition>('./SmartSnippetSuggestions.ts')['SmartSnippetSuggestions'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('SmartSnippetSuggestions', resolve),
        'SmartSnippetSuggestions'
      );
    });
  });
}
