import { Logger } from '../../misc/Logger';
import { IComponentOptionsOption } from './IComponentOptions';

export interface IComponentOptionsToValidate<T> {
  name: string;
  value: T;
  componentID: string;
}

export class ComponentOptionsValidator<T> {
  private logger: Logger;
  constructor(
    public optionDefinition: IComponentOptionsOption<T>,
    public valueToValidate: IComponentOptionsToValidate<T>,
    public optionsDictionnary: Record<any, any>
  ) {
    this.logger = new Logger(this);
  }

  public validate() {
    const { name, value, componentID } = this.valueToValidate;

    const isValid = this.optionDefinition.validator ? this.optionDefinition.validator(value) : true;
    if (isValid) {
      return;
    }

    this.logger.warn(`${componentID} .${name} has invalid value: ${value}`);
    if (this.optionDefinition.required) {
      this.logger.error(`${componentID} .${name} is required and has an invalid value: ${value}. ***THIS COMPONENT WILL NOT WORK***`);
    }

    delete this.optionsDictionnary[name];
  }
}
