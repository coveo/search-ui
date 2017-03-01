import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyHiddenQuery() {
  Initialization.registerLazyComponent('HiddenQuery', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./HiddenQuery'], () => {
        let loaded = require<IComponentDefinition>('./HiddenQuery.ts')['HiddenQuery'];
        lazyExport(loaded, resolve);
      }, 'HiddenQuery');
    });
  });
}
