import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyAnalyticsSuggestions() {
  Initialization.registerLazyComponent('AnalyticsSuggestions', ()=> {
    return new Promise((resolve, reject)=> {
      require.ensure(['./Aggregate'], ()=> {
        let loaded = require<IComponentDefinition>('./AnalyticsSuggestions.ts')['AnalyticsSuggestions'];
        loaded.doExport();
        resolve(loaded);
      }, 'AnalyticsSuggestions');
    });
  })
}
