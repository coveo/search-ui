import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazySmartSnippet() {
  LazyInitialization.registerLazyComponent('SmartSnippet', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./SmartSnippet'],
        () => {
          let loaded = require<IComponentDefinition>('./SmartSnippet.ts')['SmartSnippet'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('SmartSnippet', resolve),
        'SmartSnippet'
      );
    });
  });
}
