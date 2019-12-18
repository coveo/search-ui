import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyQueryForCommerce() {
  LazyInitialization.registerLazyComponent('QueryForCommerce', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./QueryForCommerce'],
        () => {
          let loaded = require<IComponentDefinition>('./QueryForCommerce.ts')['QueryForCommerce'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('QueryForCommerce', resolve),
        'QueryForCommerce'
      );
    });
  });
}
