import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';

export function lazyPipelineContext() {
  Initialization.registerLazyComponent('PipelineContext', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./PipelineContext'], () => {
        let loaded = require<IComponentDefinition>('./PipelineContext.ts')['PipelineContext'];
        loaded.doExport();
        resolve(loaded);
      }, 'PipelineContext');
    });
  });
}
