import { find } from 'underscore';
import { Logger } from '../../misc/Logger';
import { Utils } from '../../utils/Utils';
import { ComponentOptions } from './ComponentOptions';
import { ComponentOptionsType, IComponentLocalizedStringOptionArgs, IComponentOptionsOption } from './IComponentOptions';

export class ComponentOptionLoader {
  private logger: Logger;

  constructor(
    public element: HTMLElement,
    public values: Record<string, any>,
    public optionName: string,
    public optionDefinition: IComponentOptionsOption<any>
  ) {
    this.logger = new Logger(this);
  }

  public load() {
    return this.findFirstValidValue(
      this.loadFromAttribute.bind(this),
      this.loadFromOptionsDictionary.bind(this),
      this.loadFromDefaultValue.bind(this),
      this.loadFromDefaultFunction.bind(this)
    );
  }

  private loadFromAttribute() {
    return this.optionDefinition.load ? this.optionDefinition.load(this.element, this.optionName, this.optionDefinition) : null;
  }

  private loadFromOptionsDictionary() {
    const value = this.values[this.optionName];

    if (!value) {
      return undefined;
    }

    if (this.optionDefinition.load) {
      const attrName = ComponentOptions.attrNameFromName(this.optionName, this.optionDefinition);
      this.element.setAttribute(attrName, value);
      return this.loadFromAttribute();
    }

    return value;
  }

  private loadFromDefaultValue() {
    if (this.optionDefinition.type == ComponentOptionsType.LOCALIZED_STRING) {
      return this.loadDefaultLocalizedString();
    }

    if (Utils.isNullOrUndefined(this.optionDefinition.defaultValue)) {
      return null;
    }

    switch (this.optionDefinition.type) {
      case ComponentOptionsType.LIST:
        return [...this.optionDefinition.defaultValue];
      case ComponentOptionsType.OBJECT:
        return { ...this.optionDefinition.defaultValue };
      default:
        return this.optionDefinition.defaultValue;
    }
  }

  private loadDefaultLocalizedString() {
    if (!Utils.isNullOrUndefined(this.optionDefinition.defaultValue)) {
      return this.warnDeprecatedLocalizedStringAndReturnDefaultValue();
    }

    const isLocalizedOptionLoader = this.optionDefinition as IComponentLocalizedStringOptionArgs;
    return isLocalizedOptionLoader.localizedString ? isLocalizedOptionLoader.localizedString() : null;
  }

  private loadFromDefaultFunction() {
    return this.optionDefinition.defaultFunction ? this.optionDefinition.defaultFunction(this.element) : null;
  }

  private warnDeprecatedLocalizedStringAndReturnDefaultValue() {
    this.logger.warn(
      `defaultValue for option ${this.optionName} is deprecated. You should instead use localizedString. Not doing so could cause localization bug in your interface.`
    );
    return this.optionDefinition.defaultValue;
  }

  private findFirstValidValue(...chain: { (): any }[]): any {
    let resolvedValue: any = null;
    find(chain, fn => {
      resolvedValue = fn();
      return !Utils.isNullOrUndefined(resolvedValue);
    });
    return resolvedValue;
  }
}
