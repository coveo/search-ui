import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyAnalytics() {
  Initialization.registerLazyComponent('Analytics', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Analytics'], () => {
        let loaded = require<IComponentDefinition>('./Analytics.ts')['Analytics'];
        lazyExport(loaded, resolve);
      }, 'Analytics');
    });
  });
}
