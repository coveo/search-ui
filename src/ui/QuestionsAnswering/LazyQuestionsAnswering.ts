import { IComponentDefinition } from '../Base/Component';
import { LazyInitialization } from '../Base/Initialization';
import { lazyExport } from '../../GlobalExports';

export function lazyQuestionsAnswering() {
  LazyInitialization.registerLazyComponent('QuestionsAnswering', () => {
    return new Promise((resolve, reject) => {
      require.ensure(
        ['./QuestionsAnswering'],
        () => {
          let loaded = require<IComponentDefinition>('./QuestionsAnswering.ts')['QuestionsAnswering'];
          lazyExport(loaded, resolve);
        },
        LazyInitialization.buildErrorCallback('QuestionsAnswering', resolve),
        'QuestionsAnswering'
      );
    });
  });
}
