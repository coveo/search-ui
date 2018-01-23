import { BaseComponent } from './BaseComponent';

export class RootComponent extends BaseComponent {
  constructor(public element: HTMLElement, public type: string) {
    super(element, type);
  }
}
