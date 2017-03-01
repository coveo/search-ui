import { IComponentDefinition } from '../Base/Component';
import { Initialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyPipelineContext() {
  Initialization.registerLazyComponent('PipelineContext', () => {
    return new Promise((resolve, reject) => {
      require.ensure(['./PipelineContext'], () => {
        let loaded = require<IComponentDefinition>('./PipelineContext.ts')['PipelineContext'];
        lazyExport(loaded, resolve);
      }, 'PipelineContext');
    });
  });
}
