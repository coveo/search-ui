import { extend } from 'underscore';
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
    public optionsDictionnary: Record<any, any>
  ) {}

  public merge() {
    const { name, value } = this.valueToMerge;
    if (Utils.isNullOrUndefined(value)) {
      return;
    }

    switch (this.optionDefinition.type) {
      case ComponentOptionsType.OBJECT:
        if (!Utils.isNullOrUndefined(this.optionsDictionnary[name])) {
          this.optionsDictionnary[name] = extend(this.optionsDictionnary[name], value);
        } else {
          this.optionsDictionnary[name] = value;
        }
        break;
      case ComponentOptionsType.LOCALIZED_STRING:
        this.optionsDictionnary[name] = l(value);
        break;
      default:
        this.optionsDictionnary[name] = value;
    }
    return this.valueToMerge;
  }
}
