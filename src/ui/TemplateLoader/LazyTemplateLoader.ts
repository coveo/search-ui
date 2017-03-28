import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyTemplateLoader() {
  Initialization.registerLazyComponent('TemplateLoader', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./TemplateLoader'], () => {
        let loaded = require<IComponentDefinition>('./TemplateLoader.ts')['TemplateLoader'];
        lazyExport(loaded, resolve);
      }, 'TemplateLoader');
    });
  });
}
