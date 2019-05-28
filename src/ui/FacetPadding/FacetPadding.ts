import { Utils } from '../../utils/Utils';
import { $$, Win } from '../../utils/Dom';

export class FacetPadding {
  private pinnedTopPosition: number;
  private topSpaceElement: HTMLElement;
  private topSpaceClass = 'coveo-topSpace';
  private animationClass = 'coveo-with-animation';

  constructor(private element: HTMLElement, private paddingContainer: HTMLElement, private _window: Window = window) {
    this.initTopSpacer();
  }

  private get isPinned(): boolean {
    return Utils.exists(this.pinnedTopPosition);
  }

  private initTopSpacer() {
    $$(this.paddingContainer).on('mouseleave', () => this.unpin());

    this.topSpaceElement = $$(this.paddingContainer).find(`.${this.topSpaceClass}`);
    if (!this.topSpaceElement) {
      this.createTopSpace();
    }
  }

  private createTopSpace() {
    this.topSpaceElement = $$('div', { className: this.topSpaceClass }).el;
    $$(this.topSpaceElement).insertBefore(<HTMLElement>this.paddingContainer.firstChild);
  }

  private get facetTopPosition() {
    return this.element.getBoundingClientRect().top;
  }

  public pin() {
    this.pinnedTopPosition = this.facetTopPosition;
  }

  private setTopSpaceHeight(height: number) {
    this.topSpaceElement.style.height = `${height}px`;
  }

  private unpin() {
    if (!this.isPinned) {
      $$(this.topSpaceElement).addClass(this.animationClass);
      this.setTopSpaceHeight(0);
    }

    this.pinnedTopPosition = null;
  }

  private get scrollYPosition() {
    return new Win(this._window).scrollY();
  }

  private get offset() {
    return this.facetTopPosition - this.pinnedTopPosition;
  }

  public ensurePinnedFacetHasNotMoved() {
    if (!this.isPinned) {
      return;
    }

    $$(this.topSpaceElement).removeClass(this.animationClass);
    this.setTopSpaceHeight(0);

    this._window.scrollTo(0, this.scrollYPosition + this.offset);

    if (this.offset < 0) {
      this.setTopSpaceHeight(this.offset * -1);
    }

    this.pinnedTopPosition = null;
  }
}
