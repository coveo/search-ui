import 'styling/accessibility/_ScreenReader.scss';

export class AriaLive {
  private ariaLiveDiv: HTMLElement;

  constructor() {
    this.initAriaLive();
  }

  public updateText(text: string) {
    this.ariaLiveDiv.innerText = text;
  }

  public appendTo(el: HTMLElement) {
    el.appendChild(this.ariaLiveDiv);
  }

  private initAriaLive() {
    this.ariaLiveDiv = document.createElement('div');
    this.ariaLiveDiv.setAttribute('aria-live', 'polite');
    this.ariaLiveDiv.setAttribute('class', 'coveo-visible-to-screen-reader-only');
  }
}
