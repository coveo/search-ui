import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyTemplateLoader() {
  LazyInitialization.registerLazyComponent('TemplateLoader', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./TemplateLoader'],
        () => {
          let loaded = require<IComponentDefinition>('./TemplateLoader.ts')['TemplateLoader'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('TemplateLoader', resolve),
        'TemplateLoader'
      );
    });
  });
}
