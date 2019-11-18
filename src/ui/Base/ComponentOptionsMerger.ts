import { extend } from 'underscore';
import { l } from '../../strings/Strings';
import { Utils } from '../../utils/Utils';
import { ComponentOptionsType, IComponentOptionsOption } from './IComponentOptions';

export interface IComponentOptionsToMerge<T> {
  name: string;
  value: T;
}

export class ComponentOptionsMerger<T> {
  constructor(
    public optionDefinition: IComponentOptionsOption<T>,
    public valueToMerge: IComponentOptionsToMerge<T>,
    public optionsDictionnary: Record<any, any>
  ) {}

  public merge() {
    const { name, value } = this.valueToMerge;
    if (Utils.isNullOrUndefined(value)) {
      return;
    }

    switch (this.optionDefinition.type) {
      case ComponentOptionsType.OBJECT:
        this.optionsDictionnary[name] = extend(this.optionsDictionnary[name], value);
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
