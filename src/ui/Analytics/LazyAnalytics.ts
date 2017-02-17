import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyAnalytics() {
  Initialization.registerLazyComponent('Analytics', ()=> {
    return new Promise((resolve, reject)=> {
      require.ensure(['./Aggregate'], ()=> {
        let loaded = require<IComponentDefinition>('./Analytics.ts')['Analytics'];
        loaded.doExport();
        resolve(loaded);
      }, 'Analytics');
    });
  })
}
