import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyOmniboxResultList() {
  Initialization.registerLazyComponent('OmniboxResultList', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./OmniboxResultList'], () => {
        let loaded = require<IComponentDefinition>('./OmniboxResultList.ts')['OmniboxResultList'];
        lazyExport(loaded, resolve);
      }, 'OmniboxResultList');
    });
  });
}
