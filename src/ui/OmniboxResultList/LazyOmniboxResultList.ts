import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyOmniboxResultList() {
  LazyInitialization.registerLazyComponent('OmniboxResultList', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./OmniboxResultList'],
        () => {
          let loaded = require<IComponentDefinition>('./OmniboxResultList.ts')['OmniboxResultList'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('OmniboxResultList', resolve),
        'OmniboxResultList'
      );
    });
  });
}
