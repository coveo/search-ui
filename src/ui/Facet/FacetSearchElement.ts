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
  public searchResults: HTMLElement | undefined;

  constructor() {
    this.searchResults = document.createElement('ul');
    this.searchResults.style.display = 'none';
    $$(this.searchResults).addClass('coveo-facet-search-results');
  }

  public build(handleFacetSearchKeyUp: (e: KeyboardEvent) => void, handleFacetSearchClear: () => void, handleFacetSearchFocus: () => void) {
    this.search = document.createElement('div');
    $$(this.search).addClass('coveo-facet-search');

    this.magnifier = document.createElement('div');
    this.magnifier.innerHTML = SVGIcons.icons.search;
    $$(this.magnifier).addClass('coveo-facet-search-magnifier');
    SVGDom.addClassToSVGInContainer(this.magnifier, 'coveo-facet-search-magnifier-svg');
    this.search.appendChild(this.magnifier);

    this.wait = document.createElement('div');
    this.wait.innerHTML = SVGIcons.icons.loading;
    $$(this.wait).addClass('coveo-facet-search-wait-animation');
    SVGDom.addClassToSVGInContainer(this.wait, 'coveo-facet-search-wait-animation-svg');
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

    this.input = document.createElement('input');
    this.input.setAttribute('type', 'text');
    this.input.setAttribute('autocapitalize', 'off');
    this.input.setAttribute('autocorrect', 'off');
    $$(this.input).addClass('coveo-facet-search-input');
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
      this.searchResults.style.width = facetWidth - 40 + 'px';

      if ($$(this.searchResults).css('display') == 'none') {
        this.searchResults.style.display = '';
      }
      let searchBar = $$(this.search);
      if (searchBar.css('display') == 'none' || this.searchBarIsAnimating) {
        if ($$(this.searchResults).css('display') == 'none') {
          this.searchResults.style.display = '';
        }
        EventsUtils.addPrefixedEvent(this.search, 'AnimationEnd', evt => {
          PopupUtils.positionPopup(this.searchResults, nextTo, root, {
            horizontal: PopupHorizontalAlignment.CENTER,
            vertical: PopupVerticalAlignment.BOTTOM
          });
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
}
