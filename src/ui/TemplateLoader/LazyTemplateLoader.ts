import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyTemplateLoader() {
  Initialization.registerLazyComponent('TemplateLoader', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./TemplateLoader'], () => {
        let loaded = require<IComponentDefinition>('./TemplateLoader.ts')['TemplateLoader'];
        loaded.doExport();
        resolve(loaded);
      }, 'TemplateLoader');
    });
  });
}
