import { Model } from './Model';
import { BaseComponent } from '../ui/Base/BaseComponent';

export class ComponentStateModel extends Model {
  static ID = 'ComponentState';

  constructor(element: HTMLElement) {
    super(element, ComponentStateModel.ID, {});
  }

  public registerComponent(componentId: string, component: BaseComponent) {
    var currentAttribute = this.attributes[componentId];
    if (currentAttribute == undefined) {
      this.attributes[componentId] = [component];
    } else {
      this.attributes[componentId].push(component);
    }
  }
}
