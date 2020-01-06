import { each } from 'underscore';
import { IComponentOptionsOption } from './IComponentOptions';
import { Utils } from '../../utils/Utils';
import { Logger } from '../../misc/Logger';

export class ComponentOptionsPostProcessor<T> {
  private logger: Logger;
  constructor(
    public allOptionsDefinitions: { [name: string]: IComponentOptionsOption<T> },
    public optionsDictionnary: Record<any, any>,
    public componentID: string
  ) {
    this.logger = new Logger(this);
  }

  postProcess() {
    each(this.allOptionsDefinitions, (optionDefinition, name) => {
      if (optionDefinition.required && Utils.isNullOrUndefined(this.optionsDictionnary[name])) {
        this.logger.warn(
          `Option "${name}" is *REQUIRED* on the component "${
            this.componentID
          }". The component or the search page might *NOT WORK PROPERLY*.`
        );
      }

      if (optionDefinition.postProcessing) {
        this.optionsDictionnary[name] = optionDefinition.postProcessing(this.optionsDictionnary[name], this.optionsDictionnary);
      }
    });
  }
}
