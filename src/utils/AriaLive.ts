import 'styling/accessibility/_ScreenReader.scss';

export class AriaLive {
  private ariaLiveEl: HTMLElement;

  constructor(private searchInterface: HTMLElement) {
    this.initAriaLiveEl();
    this.appendToSearchInterface();
    this.addQueryEventListeners();
  }

  public updateText(text: string) {
    this.ariaLiveEl.innerText = text;
  }

  private appendToSearchInterface() {
    this.searchInterface.appendChild(this.ariaLiveEl);
  }

  private initAriaLiveEl() {
    this.ariaLiveEl = document.createElement('div');
    this.ariaLiveEl.setAttribute('aria-live', 'polite');
    this.ariaLiveEl.setAttribute('class', 'coveo-visible-to-screen-reader-only');
  }

  private addQueryEventListeners() {}
}
