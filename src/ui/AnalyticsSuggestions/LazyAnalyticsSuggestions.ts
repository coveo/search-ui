import { IComponentDefinition } from '../Base/Component';
import { lazyExport } from '../../GlobalExports';
import { LazyInitialization } from '../Base/Initialization';

export function lazyAnalyticsSuggestions() {
  LazyInitialization.registerLazyComponent('AnalyticsSuggestions', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./AnalyticsSuggestions'],
        () => {
          let loaded = require<IComponentDefinition>('./AnalyticsSuggestions.ts')['AnalyticsSuggestions'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('AnalyticsSuggestions', resolve),
        'AnalyticsSuggestions'
      );
    });
  });
}
