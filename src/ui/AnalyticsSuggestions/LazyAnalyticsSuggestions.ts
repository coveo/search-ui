import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyAnalyticsSuggestions() {
  Initialization.registerLazyComponent('AnalyticsSuggestions', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./AnalyticsSuggestions'], () => {
        let loaded = require<IComponentDefinition>('./AnalyticsSuggestions.ts')['AnalyticsSuggestions'];
        lazyExport(loaded, resolve);
      }, 'AnalyticsSuggestions');
    });
  });
}
