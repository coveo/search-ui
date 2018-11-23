import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyPreferencesPanel() {
  LazyInitialization.registerLazyComponent('PreferencesPanel', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./PreferencesPanel'],
        () => {
          let loaded = require<IComponentDefinition>('./PreferencesPanel.ts')['PreferencesPanel'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('lazyPreferencesPanel', resolve),
        'PreferencesPanel'
      );
    });
  });
}
