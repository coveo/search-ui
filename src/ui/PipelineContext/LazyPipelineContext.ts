import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyPipelineContext() {
  LazyInitialization.registerLazyComponent('PipelineContext', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./PipelineContext'],
        () => {
          let loaded = require<IComponentDefinition>('./PipelineContext.ts')['PipelineContext'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('PipelineContext', resolve),
        'PipelineContext'
      );
    });
  });
}
