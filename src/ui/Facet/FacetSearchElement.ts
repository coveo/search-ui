import { $$ } from '../../utils/Dom';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import { Component } from '../Base/Component';
import { l } from '../../strings/Strings';
import { EventsUtils } from '../../utils/EventsUtils';
import { PopupUtils, PopupHorizontalAlignment, PopupVerticalAlignment } from '../../utils/PopupUtils';

export class FacetSearchElement {
  public search: HTMLElement | undefined;
  public magnifier: HTMLElement | undefined;
  public wait: HTMLElement | undefined;
  public clear: HTMLElement | undefined;
  public input: HTMLInputElement | undefined;
  public searchBarIsAnimating: boolean = false;
  public searchResults: HTMLElement;

  private static FACET_SEARCH_PADDING = 40;
  constructor() {
    this.searchResults = $$('ul', { className: 'coveo-facet-search-results' }).el;
    $$(this.searchResults).hide();
  }

  public build(handleFacetSearchKeyUp: (e: KeyboardEvent) => void, handleFacetSearchClear: () => void, handleFacetSearchFocus: () => void) {
    this.search = document.createElement('div');
    $$(this.search).addClass('coveo-facet-search');

    this.magnifier = this.buildMagnifierIcon();
    this.search.appendChild(this.magnifier);

    this.wait = this.buildWaitIcon();
    this.search.appendChild(this.wait);

    this.hideFacetSearchWaitingAnimation();

    this.clear = $$(
      'div',
      { className: 'coveo-facet-search-clear', title: l('Clear', l('Search')) },
      SVGIcons.icons.checkboxHookExclusionMore
    ).el;
    SVGDom.addClassToSVGInContainer(this.clear, 'coveo-facet-search-clear-svg');
    this.clear.style.display = 'none';
    this.search.appendChild(this.clear);

    const middle = document.createElement('div');
    $$(middle).addClass('coveo-facet-search-middle');
    this.search.appendChild(middle);

    this.input = this.buildInputElement();
    Component.pointElementsToDummyForm(this.input);
    middle.appendChild(this.input);

    $$(this.input).on('keyup', (e: KeyboardEvent) => {
      handleFacetSearchKeyUp(e);
    });
    $$(this.clear).on('click', (e: Event) => {
      handleFacetSearchClear();
    });
    $$(this.input).on('focus', (e: Event) => {
      handleFacetSearchFocus();
    });

    this.detectSearchBarAnimation();
    return this.search;
  }

  public showFacetSearchWaitingAnimation() {
    $$(this.magnifier).hide();
    $$(this.wait).show();
  }

  public hideFacetSearchWaitingAnimation() {
    $$(this.magnifier).show();
    $$(this.wait).hide();
  }

  public detectSearchBarAnimation() {
    EventsUtils.addPrefixedEvent(this.search, 'AnimationStart', event => {
      if (event.animationName == 'grow') {
        this.searchBarIsAnimating = true;
      }
    });

    EventsUtils.addPrefixedEvent(this.search, 'AnimationEnd', event => {
      if (event.animationName == 'grow') {
        this.searchBarIsAnimating = false;
      }
    });
  }

  public positionSearchResults(root: HTMLElement, facetWidth: number, nextTo: HTMLElement) {
    if (this.searchResults != null) {
      root.appendChild(this.searchResults);
      this.searchResults.style.display = 'block';
      this.searchResults.style.width = facetWidth - FacetSearchElement.FACET_SEARCH_PADDING + 'px';

      if ($$(this.searchResults).css('display') == 'none') {
        this.searchResults.style.display = '';
      }
      let searchBar = $$(this.search);
      if (searchBar.css('display') == 'none' || this.searchBarIsAnimating) {
        if ($$(this.searchResults).css('display') == 'none') {
          this.searchResults.style.display = '';
        }
        EventsUtils.addPrefixedEvent(this.search, 'AnimationEnd', () => {
          this.positionPopUp(nextTo, root);
          EventsUtils.removePrefixedEvent(this.search, 'AnimationEnd', this);
        });
      } else {
        PopupUtils.positionPopup(this.searchResults, nextTo, root, {
          horizontal: PopupHorizontalAlignment.CENTER,
          vertical: PopupVerticalAlignment.BOTTOM
        });
      }
    }
  }

  public hideSearchResultsElement() {
    $$(this.searchResults).hide();
  }

  public clearSearchInput() {
    if (this.input) {
      this.input.value = '';
    }
  }

  private buildMagnifierIcon() {
    const magnifier = document.createElement('div');
    magnifier.innerHTML = SVGIcons.icons.search;
    $$(magnifier).addClass('coveo-facet-search-magnifier');
    SVGDom.addClassToSVGInContainer(magnifier, 'coveo-facet-search-magnifier-svg');
    this.search.appendChild(magnifier);
    return magnifier;
  }

  private buildWaitIcon() {
    const wait = document.createElement('div');
    wait.innerHTML = SVGIcons.icons.loading;
    $$(wait).addClass('coveo-facet-search-wait-animation');
    SVGDom.addClassToSVGInContainer(wait, 'coveo-facet-search-wait-animation-svg');
    return wait;
  }

  private buildInputElement() {
    return <HTMLInputElement>$$('input', {
      className: 'coveo-facet-search-input',
      type: 'test',
      autocapitalize: 'off',
      autocorrect: 'off'
    }).el;
  }

  private positionPopUp(nextTo: HTMLElement, root: HTMLElement) {
    PopupUtils.positionPopup(this.searchResults, nextTo, root, {
      horizontal: PopupHorizontalAlignment.CENTER,
      vertical: PopupVerticalAlignment.BOTTOM
    });
  }
}
