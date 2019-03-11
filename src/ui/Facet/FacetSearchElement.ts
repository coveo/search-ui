import { $$, Dom } from '../../utils/Dom';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import { Component } from '../Base/Component';
import { l } from '../../strings/Strings';
import { EventsUtils } from '../../utils/EventsUtils';
import { PopupUtils, PopupHorizontalAlignment, PopupVerticalAlignment } from '../../utils/PopupUtils';
import { IFacetSearch } from './IFacetSearch';
import { FacetSearchUserInputHandler } from './FacetSearchUserInputHandler';
import { first, last, uniqueId } from 'underscore';

export class FacetSearchElement {
  public search: HTMLElement | undefined;
  public magnifier: HTMLElement | undefined;
  public wait: HTMLElement | undefined;
  public clear: HTMLElement | undefined;
  public input: HTMLInputElement | undefined;
  public combobox: HTMLElement | undefined;
  public searchBarIsAnimating: boolean = false;
  public searchResults: HTMLElement;
  public currentResult: Dom;
  public facetSearchUserInputHandler: FacetSearchUserInputHandler;

  private triggeredScroll = false;
  private static FACET_SEARCH_PADDING = 40;
  private facetSearchId = uniqueId('coveo-facet-search-results');

  constructor(private facetSearch: IFacetSearch) {
    this.facetSearchUserInputHandler = new FacetSearchUserInputHandler(this.facetSearch);
    this.searchResults = $$('ul', { id: this.facetSearchId, className: 'coveo-facet-search-results', role: 'listbox' }).el;
    $$(this.searchResults).on('scroll', () => this.handleScrollEvent());
    $$(this.searchResults).hide();
  }

  public build(handleFacetSearchClear?: () => void) {
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

    this.combobox = this.buildCombobox();
    this.search.appendChild(this.combobox);

    this.input = this.buildInputElement();
    Component.pointElementsToDummyForm(this.input);
    this.combobox.appendChild(this.input);

    $$(this.input).on('keyup', (e: KeyboardEvent) => {
      this.facetSearchUserInputHandler.handleKeyboardEvent(e);
    });
    $$(this.clear).on('click', (e: Event) => {
      handleFacetSearchClear && handleFacetSearchClear();
    });
    $$(this.input).on('focus', (e: Event) => {
      this.handleFacetSearchFocus();
    });

    this.detectSearchBarAnimation();
    return this.search;
  }

  private buildCombobox() {
    return $$('div', {
      className: 'coveo-facet-search-middle',
      ariaHaspopup: 'listbox',
      ariaExpanded: 'true'
    }).el;
  }

  private updateSelectedOption(option: Dom) {
    this.input.setAttribute('aria-activedescendant', option.getAttribute('id'));

    const previouslySelectedOption = $$(this.searchResults).find('[aria-selected^="true"]');
    previouslySelectedOption && previouslySelectedOption.setAttribute('aria-selected', 'false');

    option.setAttribute('aria-selected', 'true');
  }

  public showFacetSearchWaitingAnimation() {
    this.magnifier && $$(this.magnifier).hide();
    $$(this.wait).show();
  }

  public getValueInInputForFacetSearch() {
    return this.input.value.trim();
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
      $$(this.searchResults).show();
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
        this.positionPopUp(nextTo, root);
      }
    }
  }

  public setAsCurrentResult(toSet: Dom) {
    this.currentResult && this.currentResult.removeClass('coveo-facet-search-current-result');
    this.currentResult = toSet;
    toSet.addClass('coveo-facet-search-current-result');
    this.updateSelectedOption(toSet);
  }

  private get canExcludeCurrentResult() {
    return this.currentResult.hasClass('coveo-facet-value-will-exclude');
  }

  private toggleCanExcludeCurrentResult() {
    this.currentResult.toggleClass('coveo-facet-value-will-exclude', !this.canExcludeCurrentResult);
  }

  private announceCurrentResultCanBeExcluded() {
    const excludeIconTitle = $$(this.currentResult).find('.coveo-facet-value-exclude').title;
    this.facetSearch.updateAriaLive(excludeIconTitle);
  }

  private announceCurrentResultCanBeSelected() {
    const checkbox = this.currentResult.find('.coveo-facet-value-checkbox');
    const checkboxLabel = checkbox.getAttribute('aria-label');
    this.facetSearch.updateAriaLive(checkboxLabel);
  }

  public nextFocusableElement() {
    if (this.canExcludeCurrentResult) {
      this.toggleCanExcludeCurrentResult();
      this.moveCurrentResultDown();
      this.announceCurrentResultCanBeSelected();
    } else {
      this.toggleCanExcludeCurrentResult();
      this.announceCurrentResultCanBeExcluded();
    }
  }

  public previousFocusableElement() {
    if (!this.canExcludeCurrentResult) {
      this.moveCurrentResultUp();
      this.toggleCanExcludeCurrentResult();
      this.announceCurrentResultCanBeExcluded();
    } else {
      this.toggleCanExcludeCurrentResult();
      this.announceCurrentResultCanBeSelected();
    }
  }

  public moveCurrentResultDown() {
    let nextResult = this.currentResult.el.nextElementSibling;
    if (!nextResult) {
      nextResult = first(this.searchResults.children);
    }
    this.setAsCurrentResult($$(<HTMLElement>nextResult));
    this.highlightAndShowCurrentResultWithKeyboard();
  }

  public moveCurrentResultUp() {
    let previousResult = this.currentResult.el.previousElementSibling;
    if (!previousResult) {
      previousResult = last(this.searchResults.children);
    }
    this.setAsCurrentResult($$(<HTMLElement>previousResult));
    this.highlightAndShowCurrentResultWithKeyboard();
  }

  public highlightCurrentQueryInSearchResults(regex: RegExp) {
    const captions = this.facetSearch.getCaptions();
    captions.forEach(caption => {
      caption.innerHTML = $$(caption)
        .text()
        .replace(regex, '<span class="coveo-highlight">$1</span>');
    });
  }

  public appendToSearchResults(el: HTMLElement) {
    this.searchResults.appendChild(el);
    this.setupFacetSearchResultsEvents(el);
  }

  public focus() {
    this.input.focus();
    this.handleFacetSearchFocus();
  }

  private highlightAndShowCurrentResultWithKeyboard() {
    this.currentResult.addClass('coveo-facet-search-current-result');

    this.triggeredScroll = true;
    this.searchResults.scrollTop = this.currentResult.el.offsetTop;
  }

  private handleFacetSearchFocus() {
    if (this.facetSearch.currentlyDisplayedResults == null) {
      this.facetSearch.displayNewValues();
      this.toggleAriaAttributes(true);
    }
  }

  private setupFacetSearchResultsEvents(el: HTMLElement) {
    $$(el).on('mousemove', () => {
      this.setAsCurrentResult($$(el));
    });

    // Prevent closing the search results on the end of a touch drag
    let touchDragging = false;
    let mouseDragging = false;
    $$(el).on('mousedown', () => (mouseDragging = false));
    $$(el).on('mousemove', () => (mouseDragging = true));
    $$(el).on('touchmove', () => (touchDragging = true));

    $$(el).on('mouseup touchend', () => {
      if (!touchDragging && !mouseDragging) {
        setTimeout(() => {
          this.facetSearch.dismissSearchResults();
        }, 0); // setTimeout is to give time to trigger the click event before hiding the search menu.
      }
      touchDragging = false;
      mouseDragging = false;
    });
  }

  public hideSearchResultsElement() {
    this.toggleAriaAttributes(false);
    $$(this.searchResults).hide();
    $$(this.searchResults).remove();
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
      type: 'text',
      autocapitalize: 'off',
      autocorrect: 'off',
      ariaLabel: l('Search'),
      ariaHaspopup: 'true',
      ariaAutocomplete: 'list'
    }).el;
  }

  private positionPopUp(nextTo: HTMLElement, root: HTMLElement) {
    PopupUtils.positionPopup(this.searchResults, nextTo, root, {
      horizontal: PopupHorizontalAlignment.CENTER,
      vertical: PopupVerticalAlignment.BOTTOM
    });
  }

  private handleScrollEvent() {
    if (this.triggeredScroll) {
      this.triggeredScroll = false;
    } else {
      this.facetSearchUserInputHandler.handleFacetSearchResultsScroll();
    }
  }

  private toggleAriaAttributes(enable: boolean) {
    if (!this.input || !this.combobox) {
      return;
    }

    $$(this.combobox).setAttribute('role', enable ? 'combobox' : '');
    $$(this.combobox).setAttribute('aria-owns', enable ? this.facetSearchId : '');
    $$(this.input).setAttribute('aria-controls', enable ? this.facetSearchId : '');
  }
}
