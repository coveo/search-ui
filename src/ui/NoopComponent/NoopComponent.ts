import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';

export class NoopComponent extends Component {
  static ID = 'NoopComponent';

  constructor(element: HTMLElement, options: any, bindings: IComponentBindings) {
    super(element, NoopComponent.ID, bindings);
  }
}
