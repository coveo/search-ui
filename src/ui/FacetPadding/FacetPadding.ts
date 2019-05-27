import { Utils } from '../../utils/Utils';
import { $$, Win } from '../../utils/Dom';

export class FacetPadding {
  private pinnedTopPosition: number;
  private unpinnedTopPosition: number;
  private topSpaceElement: HTMLElement;
  private topSpaceClass = 'coveo-topSpace';
  private animationClass = 'coveo-with-animation';

  constructor(private element: HTMLElement, private paddingContainer: HTMLElement) {
    this.initTopSpacer();
  }

  private get isPinned(): boolean {
    return Utils.exists(this.pinnedTopPosition);
  }

  private get shouldUnpin(): boolean {
    return Utils.exists(this.unpinnedTopPosition);
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

  private setTopSpaceHeight(height: string) {
    this.topSpaceElement.style.height = height;
  }

  private unpin() {
    if (this.shouldUnpin) {
      $$(this.topSpaceElement).addClass(this.animationClass);
      this.setTopSpaceHeight('0');
    }

    this.unpinnedTopPosition = null;
    this.pinnedTopPosition = null;
  }

  private get scrollYPosition() {
    return new Win(window).scrollY();
  }

  private get offset() {
    return this.facetTopPosition - this.pinnedTopPosition;
  }

  public ensurePinnedFacetHasNotMoved() {
    if (!this.isPinned) {
      return;
    }

    $$(this.topSpaceElement).removeClass(this.animationClass);
    this.setTopSpaceHeight('0');

    window.scrollTo(0, this.scrollYPosition + this.offset);

    if (this.offset < 0) {
      this.setTopSpaceHeight(`${this.offset * -1}px`);
    }

    this.unpinnedTopPosition = this.pinnedTopPosition;
    this.pinnedTopPosition = null;
  }
}
