import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyResultAttachment() {
  LazyInitialization.registerLazyComponent('ResultAttachments', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./ResultAttachments'],
        () => {
          let loaded = require<IComponentDefinition>('./ResultAttachments.ts')['ResultAttachments'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('ResultAttachments', resolve),
        'ResultAttachments'
      );
    });
  });
}
