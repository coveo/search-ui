import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyAnalytics() {
  LazyInitialization.registerLazyComponent('Analytics', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./Analytics'], () => {
        let loaded = require<IComponentDefinition>('./Analytics.ts')['Analytics'];
        lazyExport(loaded, resolve);
      }, LazyInitialization.buildErrorCallback('Analytics'), 'Analytics');
    });
  });
}
