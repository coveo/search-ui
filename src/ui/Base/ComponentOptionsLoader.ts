import { extend, find } from 'underscore';
import { Logger } from '../../misc/Logger';
import { Utils } from '../../utils/Utils';
import { ComponentOptionsType, IComponentLocalizedStringOptionArgs, IComponentOptionsOption } from './IComponentOptions';

export class ComponentOptionLoader {
  private resolvedValue: any = null;
  private logger: Logger;

  constructor(
    public element: HTMLElement,
    public values: Record<any, any>,
    public optionName: string,
    public optionDefinition: IComponentOptionsOption<any>
  ) {
    this.logger = new Logger(this);
  }

  public load() {
    return this.findFirstValidValue(
      this.loadFromAttribute.bind(this),
      this.loadFromOptionsDictionnary.bind(this),
      this.loadFromDefaultValue.bind(this),
      this.loadFromDefaultFunction.bind(this)
    );
  }

  private loadFromAttribute() {
    return this.optionDefinition.load ? this.optionDefinition.load(this.element, this.optionName, this.optionDefinition) : null;
  }

  private loadFromOptionsDictionnary() {
    return this.values[this.optionName];
  }

  private loadFromDefaultValue() {
    switch (this.optionDefinition.type) {
      case ComponentOptionsType.LOCALIZED_STRING:
        if (!Utils.isNullOrUndefined(this.optionDefinition.defaultValue)) {
          this.logger.warn(
            `defaultValue for option ${
              this.optionName
            } is deprecated. You should instead use localizedString. Not doing so could cause localization bug in your interface.`
          );
          return this.optionDefinition.defaultValue;
        }

        const isLocalizedOptionLoader = this.optionDefinition as IComponentLocalizedStringOptionArgs;
        return isLocalizedOptionLoader.localizedString ? isLocalizedOptionLoader.localizedString() : null;

      case ComponentOptionsType.LIST:
        return extend([], this.optionDefinition.defaultValue);
      case ComponentOptionsType.OBJECT:
        return extend({}, this.optionDefinition.defaultValue);
      default:
        return this.optionDefinition.defaultValue;
    }
  }

  private loadFromDefaultFunction() {
    return this.optionDefinition.defaultFunction ? this.optionDefinition.defaultFunction(this.element) : null;
  }

  private findFirstValidValue(...chain: { (): any }[]): any {
    find(chain, fn => {
      this.resolvedValue = fn();
      return !Utils.isNullOrUndefined(this.resolvedValue);
    });

    return this.resolvedValue;
  }
}
