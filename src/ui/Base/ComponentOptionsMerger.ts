import { l } from '../../strings/Strings';
import { Utils } from '../../utils/Utils';
import { ComponentOptionsType, IComponentOptionsOption } from './IComponentOptions';

export interface IComponentOptionsToMerge {
  name: string;
  value: any;
}

export class ComponentOptionsMerger {
  constructor(
    public optionDefinition: IComponentOptionsOption<any>,
    public valueToMerge: IComponentOptionsToMerge,
    public optionsDictionary: Record<string, any>
  ) {}

  public merge() {
    const { name, value } = this.valueToMerge;
    if (Utils.isNullOrUndefined(value)) {
      return;
    }

    switch (this.optionDefinition.type) {
      case ComponentOptionsType.OBJECT:
        const currentValue = this.optionsDictionary[name] || {};
        this.optionsDictionary[name] = { ...currentValue, ...value };
        break;
      case ComponentOptionsType.LOCALIZED_STRING:
        this.optionsDictionary[name] = l(value);
        break;
      default:
        this.optionsDictionary[name] = value;
    }
    return this.valueToMerge;
  }
}
