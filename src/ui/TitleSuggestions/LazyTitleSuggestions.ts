import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyTitleSuggestions() {
  LazyInitialization.registerLazyComponent('TitleSuggestions', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./TitleSuggestions'],
        () => {
          let loaded = require<IComponentDefinition>('./TitleSuggestions.ts')['TitleSuggestions'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('TitleSuggestions', resolve),
        'TitleSuggestions'
      );
    });
  });
}
