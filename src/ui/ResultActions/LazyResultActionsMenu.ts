import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultActionsMenu() {
  LazyInitialization.registerLazyComponent('ResultActionsMenu', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ResultActionsMenu'],
        () => {
          let loaded = require<IComponentDefinition>('./ResultActionsMenu.ts')['ResultActionsMenu'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ResultActionsMenu', resolve),
        'ResultActionsMenu'
      );
    });
  });
}
