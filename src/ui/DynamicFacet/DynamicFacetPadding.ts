import { DynamicFacet } from './DynamicFacet';
import { Utils } from '../../utils/Utils';
import { $$, Win } from '../../utils/Dom';

export class DynamicFacetPadding {
  private paddingContainer: HTMLElement;
  private pinnedViewportPosition: number;
  private unpinnedViewportPosition: number;
  private pinnedTopSpace: HTMLElement;
  private pinnedBottomSpace: HTMLElement;

  constructor(private facet: DynamicFacet) {
    this.initBottomAndTopSpacer();
  }

  private isFacetPinned(): boolean {
    return Utils.exists(this.pinnedViewportPosition);
  }

  private shouldFacetUnpin(): boolean {
    return Utils.exists(this.unpinnedViewportPosition);
  }

  private initBottomAndTopSpacer() {
    this.paddingContainer = $$(this.facet.element).parent('coveo-facet-column');
    $$(this.paddingContainer).on('mouseleave', () => this.unpinFacetPosition());

    this.pinnedTopSpace = $$(this.paddingContainer).find('.coveo-topSpace');
    if (!this.pinnedTopSpace) {
      this.createTopSpace();
    }

    this.pinnedBottomSpace = $$(this.paddingContainer).find('.coveo-bottomSpace');
    if (!this.pinnedBottomSpace) {
      this.createBottomSpace();
    }
  }

  private createTopSpace() {
    this.pinnedTopSpace = document.createElement('div');
    $$(this.pinnedTopSpace).addClass('coveo-topSpace');
    $$(this.pinnedTopSpace).insertBefore(<HTMLElement>this.paddingContainer.firstChild);
  }

  private createBottomSpace() {
    this.pinnedBottomSpace = document.createElement('div');
    $$(this.pinnedBottomSpace).addClass('coveo-bottomSpace');
    this.paddingContainer.appendChild(this.pinnedBottomSpace);
  }

  public pinFacetPosition() {
    this.pinnedViewportPosition = this.facet.element.getBoundingClientRect().top;
  }

  private unpinFacetPosition() {
    if (this.shouldFacetUnpin()) {
      $$(this.pinnedTopSpace).addClass('coveo-with-animation');
      $$(this.pinnedBottomSpace).addClass('coveo-with-animation');
      this.pinnedTopSpace.style.height = '0px';
      this.pinnedBottomSpace.style.height = '0px';
    }

    this.unpinnedViewportPosition = null;
    this.pinnedViewportPosition = null;
  }

  private get offset() {
    return this.facet.element.getBoundingClientRect().top - this.pinnedViewportPosition;
  }

  public ensurePinnedFacetHasNotMoved() {
    if (!this.isFacetPinned()) {
      return;
    }

    $$(this.pinnedTopSpace).removeClass('coveo-with-animation');
    $$(this.pinnedBottomSpace).removeClass('coveo-with-animation');
    this.pinnedTopSpace.style.height = '0px';
    this.pinnedBottomSpace.style.height = '0px';

    // First try to adjust position by scrolling the page
    window.scrollTo(0, new Win(window).scrollY() + this.offset);

    // If the facet element is scrolled up in the viewport,
    // move it down by adding space in the top container
    if (this.offset < 0) {
      this.pinnedTopSpace.style.height = this.offset * 1 + 'px';
    }

    this.unpinnedViewportPosition = this.pinnedViewportPosition;
    this.pinnedViewportPosition = null;
  }
}
