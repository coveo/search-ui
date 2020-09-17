import { mock } from './MockEnvironment';

export type EventListenersMap = Record<string, ((event: Event) => any)[]>;

export type EventTriggersMap = Record<string, Event[]>;

export class MockElement<T extends Element> {
  public readonly element: T;
  public eventListeners: EventListenersMap = {};
  public manualEventTriggers: EventTriggersMap = {};

  constructor(constructorFunc: { new (...args: any[]): T }) {
    this.element = mock(constructorFunc) as T;
    (this.element.addEventListener as jasmine.Spy).and.callFake((name: string, listener: (e: Event) => any) =>
      this.addEventListener(name, listener)
    );
    (this.element.dispatchEvent as jasmine.Spy).and.callFake((event: Event) => this.dispatchEvent(event));
  }

  private addEventListener(name: string, listener: (e: Event) => any) {
    this.eventListeners[name] = this.eventListeners[name] || [];
    this.eventListeners[name].push(listener);
  }

  private dispatchEvent(event: Event) {
    const name = event.type;
    this.manualEventTriggers[name] = this.manualEventTriggers[name] || [];
    this.manualEventTriggers[name].push(event);
    if (this.eventListeners[name]) {
      this.eventListeners[name].forEach(listener => listener(event));
    }
  }
}

export class MockHTMLElement extends MockElement<HTMLElement> {
  constructor() {
    super(HTMLElement);
  }
}
