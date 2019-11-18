import { each } from 'underscore';
import { IComponentOptionsOption } from './IComponentOptions';

export class ComponentOptionsPostProcessing<T> {
  constructor(public allOptionsDefinitions: { [name: string]: IComponentOptionsOption<T> }, public optionsDictionnary: Record<any, any>) {}

  postProcess() {
    each(this.allOptionsDefinitions, (optionDefinition, name) => {
      if (optionDefinition.postProcessing) {
        this.optionsDictionnary[name] = optionDefinition.postProcessing(this.optionsDictionnary[name], this.optionsDictionnary);
      }
    });
  }
}
