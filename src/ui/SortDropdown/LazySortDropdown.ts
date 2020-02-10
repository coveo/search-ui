import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazySortDropdown() {
  LazyInitialization.registerLazyComponent('SortDropdown', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./SortDropdown'],
        () => {
          let loaded = require<IComponentDefinition>('./SortDropdown.ts')['SortDropdown'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('SortDropdown', resolve),
        'SortDropdown'
      );
    });
  });
}
