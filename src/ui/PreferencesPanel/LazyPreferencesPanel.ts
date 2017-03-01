import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyPreferencesPanel() {
  Initialization.registerLazyComponent('PreferencesPanel', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./PreferencesPanel'], () => {
        let loaded = require<IComponentDefinition>('./PreferencesPanel.ts')['PreferencesPanel'];
        lazyExport(loaded, resolve);
      }, 'PreferencesPanel');
    });
  });
}
