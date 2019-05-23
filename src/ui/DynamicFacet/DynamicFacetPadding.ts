import { DynamicFacet } from './DynamicFacet';
import { Utils } from '../../utils/Utils';
import { $$, Win } from '../../utils/Dom';

export class DynamicFacetPadding {
  private paddingContainer: HTMLElement;
  private pinnedFacetPosition: number;
  private unpinnedFacetPosition: number;
  private topSpaceElement: HTMLElement;

  constructor(private facet: DynamicFacet) {
    this.initBottomAndTopSpacer();
  }

  private isFacetPinned(): boolean {
    return Utils.exists(this.pinnedFacetPosition);
  }

  private shouldFacetUnpin(): boolean {
    return Utils.exists(this.unpinnedFacetPosition);
  }

  private initBottomAndTopSpacer() {
    this.paddingContainer = $$(this.facet.element).parent('coveo-facet-column');
    $$(this.paddingContainer).on('mouseleave', () => this.unpinFacetPosition());

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

  public pinFacetPosition() {
    this.pinnedFacetPosition = this.facetTopPosition;
    console.log('pinnedFacetPosition', this.pinnedFacetPosition);
  }

  private unpinFacetPosition() {
    if (this.shouldFacetUnpin()) {
      $$(this.topSpaceElement).addClass('coveo-with-animation');
      this.topSpaceElement.style.height = '0px';
    }

    this.unpinnedFacetPosition = null;
    this.pinnedFacetPosition = null;
  }

  private get scrollYPosition() {
    return new Win(window).scrollY();
  }

  private get offset() {
    return this.facetTopPosition - this.pinnedFacetPosition;
  }

  public ensurePinnedFacetHasNotMoved() {
    if (!this.isFacetPinned()) {
      return;
    }

    $$(this.topSpaceElement).removeClass('coveo-with-animation');
    this.topSpaceElement.style.height = '0px';

    if (this.offset < 0) {
      this.topSpaceElement.style.height = `${Math.abs(this.offset)}px`;
    }

    if (this.offset > 0) {
      window.scrollTo(0, this.scrollYPosition + this.offset);
    }

    this.unpinnedFacetPosition = this.pinnedFacetPosition;
    this.pinnedFacetPosition = null;
  }
}
