import { DynamicFacet } from './DynamicFacet';
import { Utils } from '../../utils/Utils';
import { $$, Win } from '../../utils/Dom';

export class DynamicFacetPadding {
  private paddingContainer: HTMLElement;
  private pinnedPosition: number;
  private unpinnedPosition: number;
  private topSpaceElement: HTMLElement;

  constructor(private facet: DynamicFacet) {
    this.initBottomAndTopSpacer();
  }

  private isPinned(): boolean {
    return Utils.exists(this.pinnedPosition);
  }

  private shouldUnpin(): boolean {
    return Utils.exists(this.unpinnedPosition);
  }

  private initBottomAndTopSpacer() {
    this.paddingContainer = $$(this.facet.element).parent('coveo-facet-column');
    $$(this.paddingContainer).on('mouseleave', () => this.unpinPosition());

    this.topSpaceElement = $$(this.paddingContainer).find('.coveo-topSpace');
    if (!this.topSpaceElement) {
      this.createTopSpace();
    }
  }

  private createTopSpace() {
    this.topSpaceElement = $$('div', { className: 'coveo-topSpace' }).el;
    $$(this.topSpaceElement).insertBefore(<HTMLElement>this.paddingContainer.firstChild);
  }

  private get facetTopPosition() {
    return this.facet.element.getBoundingClientRect().top;
  }

  public pinPosition() {
    this.pinnedPosition = this.facetTopPosition;
  }

  private unpinPosition() {
    if (this.shouldUnpin()) {
      $$(this.topSpaceElement).addClass('coveo-with-animation');
      this.topSpaceElement.style.height = '0px';
    }

    this.unpinnedPosition = null;
    this.pinnedPosition = null;
  }

  private get scrollYPosition() {
    return new Win(window).scrollY();
  }

  private get offset() {
    return this.facetTopPosition - this.pinnedPosition;
  }

  public ensurePinnedFacetHasNotMoved() {
    if (!this.isPinned()) {
      return;
    }

    $$(this.topSpaceElement).removeClass('coveo-with-animation');
    this.topSpaceElement.style.height = '0px';

    window.scrollTo(0, this.scrollYPosition + this.offset);

    if (this.offset < 0) {
      this.topSpaceElement.style.height = `${this.offset * -1}px`;
    }

    this.unpinnedPosition = this.pinnedPosition;
    this.pinnedPosition = null;
  }
}
