/// <reference path="Facet.ts" />

import { IIndexFieldValue } from '../../rest/FieldValue';
import { Facet } from './Facet';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { InitializationEvents } from '../../events/InitializationEvents';
import { FacetSearchParameters } from './FacetSearchParameters';
import { IAnalyticsFacetMeta, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { IEndpointError } from '../../rest/EndpointError';
import { l } from '../../strings/Strings';
import { Assert } from '../../misc/Assert';
import { FacetValue } from './FacetValues';
import { StringUtils } from '../../utils/StringUtils';
import { IFacetSearchValuesListKlass } from './FacetSearchValuesList';
import { FacetValueElement } from './FacetValueElement';
import { ModalBox } from '../../ExternalModulesShim';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { ResponsiveComponentsUtils } from '../ResponsiveComponents/ResponsiveComponentsUtils';
import { FacetValuesOrder } from './FacetValuesOrder';
import 'styling/_FacetSearch';
import { each, debounce, map, pluck } from 'underscore';
import { FacetSearchElement } from './FacetSearchElement';
import { IFacetSearch } from './IFacetSearch';

/**
 * Used by the {@link Facet} component to render and handle the facet search part of each facet.
 */
export class FacetSearch implements IFacetSearch {
  public currentlyDisplayedResults: string[];
  public facetSearchElement: FacetSearchElement;
  public facetSearchPromise: Promise<IIndexFieldValue[]>;
  public moreValuesToFetch = true;

  private facetSearchTimeout: number;
  private onResize: (...args: any[]) => void;
  private onDocumentClick: (e: Event) => void;
  private lastSearchWasEmpty = true;

  constructor(public facet: Facet, public facetSearchValuesListKlass: IFacetSearchValuesListKlass, private root: HTMLElement) {
    this.facetSearchElement = new FacetSearchElement(this);
    this.onResize = debounce(() => {
      // Mitigate issues in UT where the window in phantom js might get resized in the scope of another test.
      // These would point to random instance of a test karma object, and not a real search interface.
      if (this.facet instanceof Facet && this.facet.searchInterface instanceof SearchInterface) {
        if (this.shouldPositionSearchResults()) {
          this.positionSearchResults();
        }
      }
    }, 250);
    this.onDocumentClick = (e: Event) => {
      this.handleClickElsewhere(e);
    };
    window.addEventListener('resize', this.onResize);
    document.addEventListener('click', (e: Event) => this.onDocumentClick(e));
    $$(facet.root).on(InitializationEvents.nuke, () => this.handleNuke());
  }

  public get facetType() {
    return Facet.ID;
  }

  /**
   * Build the search component and return an `HTMLElement` which can be appended to the {@link Facet}.
   * @returns {HTMLElement}
   */
  public build(): HTMLElement {
    return this.buildBaseSearch();
  }

  /**
   * Position the search results at the footer of the facet.
   */
  public positionSearchResults(nextTo: HTMLElement = this.search) {
    this.facetSearchElement.positionSearchResults(this.root, this.facet.element.clientWidth, nextTo);
  }

  public fetchMoreValues() {
    this.triggerNewFacetSearch(this.buildParamsForFetchingMore());
  }

  /**
   * Dismiss the search results
   */
  public dismissSearchResults() {
    this.cancelAnyPendingSearchOperation();
    this.facet.unfadeInactiveValuesInMainList();
    $$(this.searchResults).empty();
    this.moreValuesToFetch = true;
    $$(this.search).removeClass('coveo-facet-search-no-results');
    $$(this.facet.element).removeClass('coveo-facet-searching');
    this.facetSearchElement.hideSearchResultsElement();
    this.input.value = '';
    $$(this.clear).hide();
    this.currentlyDisplayedResults = undefined;
  }

  /**
   * Trigger a new facet search, and display the results.
   * @param params
   */
  public triggerNewFacetSearch(params: FacetSearchParameters) {
    this.cancelAnyPendingSearchOperation();
    this.facetSearchElement.showFacetSearchWaitingAnimation();

    this.facet.logger.info('Triggering new facet search');

    this.facetSearchPromise = this.facet.facetQueryController.search(params);

    if (this.facetSearchPromise) {
      this.facetSearchPromise
        .then((fieldValues: IIndexFieldValue[]) => {
          this.facet.usageAnalytics.logCustomEvent<IAnalyticsFacetMeta>(
            analyticsActionCauseList.facetSearch,
            {
              facetId: this.facet.options.id,
              facetField: this.facet.options.field.toString(),
              facetTitle: this.facet.options.title
            },
            this.facet.root
          );
          this.facet.logger.debug('Received field values', fieldValues);
          this.processNewFacetSearchResults(fieldValues, params);
          this.facetSearchElement.hideFacetSearchWaitingAnimation();
          this.facetSearchPromise = undefined;
        })
        .catch((error: IEndpointError) => {
          // The request might be normally cancelled if another search is triggered.
          // In this case we do not hide the animation to prevent flicking.
          if (Utils.exists(error)) {
            this.facet.logger.error('Error while retrieving facet values', error);
            this.facetSearchElement.hideFacetSearchWaitingAnimation();
          }
          this.facetSearchPromise = undefined;
          return null;
        });
    }
  }

  /**
   * Trigger the event associated with the focus of the search input.
   */
  public focus(): void {
    this.facetSearchElement.focus();
  }

  public get searchResults() {
    return this.facetSearchElement.searchResults;
  }

  public get searchBarIsAnimating() {
    return this.facetSearchElement.searchBarIsAnimating;
  }

  public get search() {
    return this.facetSearchElement.search;
  }

  public setExpandedFacetSearchAccessibilityAttributes(searchResultsElement: HTMLElement) {
    this.facet.setExpandedFacetSearchAccessibilityAttributes(searchResultsElement);
  }

  public setCollapsedFacetSearchAccessibilityAttributes() {
    this.facet.setCollapsedFacetSearchAccessibilityAttributes();
  }

  public keyboardEventDefaultHandler() {
    this.moreValuesToFetch = true;
    this.highlightCurrentQueryWithinSearchResults();
    if (!this.inputIsEmpty()) {
      this.lastSearchWasEmpty = false;
      this.displayNewValues(this.buildParamsForNormalSearch());
    } else if (!this.lastSearchWasEmpty) {
      // This normally happen if a user delete the search box content to go back to "empty" state.
      this.currentlyDisplayedResults = undefined;
      $$(this.searchResults).empty();
      this.lastSearchWasEmpty = true;
      this.displayNewValues(this.buildParamsForFetchingMore());
    }
  }

  public keyboardNavigationEnterPressed(event: KeyboardEvent) {
    if (event.shiftKey) {
      this.triggerNewFacetSearch(this.buildParamsForNormalSearch());
    } else {
      if (this.searchResults.style.display != 'none') {
        this.performActionOnCurrentSearchResult();
        this.dismissSearchResults();
      } else if ($$(this.search).is('.coveo-facet-search-no-results')) {
        this.selectAllValuesMatchingSearch();
      }
    }
  }

  public keyboardNavigationDeletePressed(event: KeyboardEvent) {
    if (event.shiftKey) {
      this.performExcludeActionOnCurrentSearchResult();
      this.dismissSearchResults();
      this.input.value = '';
    }
  }

  public displayNewValues(params: FacetSearchParameters = this.buildParamsForExcludingCurrentlyDisplayedValues()) {
    this.cancelAnyPendingSearchOperation();
    this.facetSearchTimeout = window.setTimeout(() => {
      this.triggerNewFacetSearch(params);
    }, this.facet.options.facetSearchDelay);
  }

  public getCaptions() {
    return $$(this.searchResults).findAll('.coveo-facet-value-caption');
  }

  public getValueInInputForFacetSearch() {
    return this.facetSearchElement.getValueInInputForFacetSearch();
  }

  public updateAriaLive(text: string) {
    this.facet.searchInterface.ariaLive.updateText(text);
  }

  private get input() {
    return this.facetSearchElement.input;
  }

  private get clear() {
    return this.facetSearchElement.clear;
  }

  private shouldPositionSearchResults(): boolean {
    return !ResponsiveComponentsUtils.isSmallFacetActivated($$(this.root)) && $$(this.facet.element).hasClass('coveo-facet-searching');
  }

  private buildBaseSearch(): HTMLElement {
    this.facetSearchElement.build(() => this.handleFacetSearchClear());
    $$(this.facetSearchElement.input).on('keyup', () => this.showOrHideClearElement());
    return this.search;
  }

  private handleNuke() {
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('click', this.onDocumentClick);
  }

  private handleClickElsewhere(event: Event) {
    if (this.currentlyDisplayedResults && this.search != event.target && this.searchResults != event.target && this.input != event.target) {
      this.dismissSearchResults();
    }
  }

  private handleFacetSearchClear() {
    this.input.value = '';
    $$(this.clear).hide();
    this.dismissSearchResults();
  }

  private showOrHideClearElement() {
    if (!this.inputIsEmpty()) {
      $$(this.clear).show();
    } else {
      $$(this.clear).hide();
      $$(this.search).removeClass('coveo-facet-search-no-results');
    }
  }
  private cancelAnyPendingSearchOperation() {
    if (Utils.exists(this.facetSearchTimeout)) {
      clearTimeout(this.facetSearchTimeout);
      this.facetSearchTimeout = undefined;
    }
    if (Utils.exists(this.facetSearchPromise)) {
      Promise.reject(this.facetSearchPromise).catch(() => {});
      this.facetSearchPromise = undefined;
    }

    this.facetSearchElement.hideFacetSearchWaitingAnimation();
  }

  private inputIsEmpty() {
    return this.input.value.trim() == '';
  }

  private processNewFacetSearchResults(fieldValues: IIndexFieldValue[], facetSearchParameters: FacetSearchParameters) {
    Assert.exists(fieldValues);
    fieldValues = new FacetValuesOrder(this.facet, this.facet.facetSort).reorderValues(fieldValues);
    if (fieldValues.length > 0) {
      $$(this.search).removeClass('coveo-facet-search-no-results');
      this.facet.fadeInactiveValuesInMainList(this.facet.options.facetSearchDelay);
      this.rebuildSearchResults(fieldValues, facetSearchParameters);
      if (!facetSearchParameters.fetchMore) {
        this.showSearchResultsElement();
      }
      this.highlightCurrentQueryWithinSearchResults();
      this.makeFirstSearchResultTheCurrentOne();
    } else {
      if (facetSearchParameters.fetchMore) {
        this.moreValuesToFetch = false;
      } else {
        this.facetSearchElement.hideSearchResultsElement();
        $$(this.search).addClass('coveo-facet-search-no-results');
      }
    }
  }

  private rebuildSearchResults(fieldValues: IIndexFieldValue[], facetSearchParameters: FacetSearchParameters) {
    Assert.exists(fieldValues);
    if (!facetSearchParameters.fetchMore) {
      $$(this.searchResults).empty();
    }

    const facetSearchHasQuery = Utils.isNonEmptyString(facetSearchParameters.valueToSearch);

    if (facetSearchHasQuery) {
      this.appendSelectAllResultsButton();
    }

    let facetValues = map(fieldValues, fieldValue => {
      return FacetValue.create(fieldValue);
    });
    each(new this.facetSearchValuesListKlass(this.facet, FacetValueElement).build(facetValues), (listElement: HTMLElement) => {
      this.facetSearchElement.appendToSearchResults(listElement);
    });
    if (this.currentlyDisplayedResults) {
      this.currentlyDisplayedResults = this.currentlyDisplayedResults.concat(pluck(facetValues, 'value'));
    } else {
      this.currentlyDisplayedResults = pluck(facetValues, 'value');
    }

    each($$(this.searchResults).findAll('.coveo-facet-selectable'), (elem: HTMLElement, index: number) => {
      $$(elem).setAttribute('id', `coveo-facet-search-${this.facet.options.id}-suggestion-${index}`);
      $$(elem).setAttribute('role', 'option');
      $$(elem).setAttribute('aria-selected', 'false');
      $$(elem).addClass('coveo-facet-search-selectable');
    });
  }

  private appendSelectAllResultsButton() {
    const selectAll = document.createElement('li');
    $$(selectAll).addClass(['coveo-facet-selectable', 'coveo-facet-search-selectable', 'coveo-facet-search-select-all']);
    $$(selectAll).text(l('SelectAll'));
    $$(selectAll).setAttribute('aria-hidden', 'true');
    $$(selectAll).on('click', () => this.selectAllValuesMatchingSearch());
    this.facetSearchElement.appendToSearchResults(selectAll);
  }

  private buildParamsForNormalSearch() {
    let params = new FacetSearchParameters(this.facet);
    params.setValueToSearch(this.getValueInInputForFacetSearch());
    params.fetchMore = false;
    return params;
  }

  private buildParamsForFetchingMore() {
    let params = this.buildParamsForExcludingCurrentlyDisplayedValues();
    params.fetchMore = true;
    return params;
  }

  protected buildParamsForExcludingCurrentlyDisplayedValues() {
    let params = new FacetSearchParameters(this.facet);
    params.excludeCurrentlyDisplayedValuesInSearch(this.searchResults);
    params.setValueToSearch(this.getValueInInputForFacetSearch());
    return params;
  }

  private showSearchResultsElement() {
    this.positionSearchResults();
  }

  private highlightCurrentQueryWithinSearchResults() {
    let search = this.getValueInInputForFacetSearch();
    let regex = new RegExp('(' + StringUtils.wildcardsToRegex(search, this.facet.options.facetSearchIgnoreAccents) + ')', 'ig');
    this.facetSearchElement.highlightCurrentQueryInSearchResults(regex);
  }

  private makeFirstSearchResultTheCurrentOne() {
    this.facetSearchElement.setAsCurrentResult($$(this.getSelectables()[0]));
  }

  private getSelectables(target = this.searchResults) {
    return $$(target).findAll('.coveo-facet-selectable');
  }

  private performActionOnCurrentSearchResult() {
    let current = $$(this.searchResults).find('.coveo-facet-search-current-result');
    Assert.check(current != undefined);

    const shouldExclude = $$(current).hasClass('coveo-facet-value-will-exclude');

    if (shouldExclude) {
      const excludeIcon = $$(current).find('.coveo-facet-value-exclude');
      excludeIcon.click();
      return;
    }

    const checkbox = <HTMLInputElement>$$(current).find('input[type="checkbox"]');

    if (checkbox) {
      checkbox.checked = true;
      $$(checkbox).trigger('change');
    } else {
      current.click();
    }
  }

  private performExcludeActionOnCurrentSearchResult() {
    let current = $$(this.searchResults).find('.coveo-facet-search-current-result');
    Assert.check(current != null);
    let valueCaption = $$(current).find('.coveo-facet-value-caption');
    let valueElement = this.facet.facetValuesList.get($$(valueCaption).text());

    valueElement.toggleExcludeWithUA();
  }

  protected selectAllValuesMatchingSearch() {
    this.facet.showWaitingAnimation();

    let searchParameters = new FacetSearchParameters(this.facet);
    searchParameters.nbResults = 1000;
    searchParameters.setValueToSearch(this.getValueInInputForFacetSearch());
    this.facet.facetQueryController.search(searchParameters).then((fieldValues: IIndexFieldValue[]) => {
      this.dismissSearchResults();
      ModalBox.close(true);
      let facetValues = map(fieldValues, fieldValue => {
        let facetValue = this.facet.values.get(fieldValue.value);
        if (!Utils.exists(facetValue)) {
          facetValue = FacetValue.create(fieldValue);
        }
        facetValue.selected = true;
        facetValue.excluded = false;
        return facetValue;
      });
      this.facet.processFacetSearchAllResultsSelected(facetValues);
    });
    this.dismissSearchResults();
  }
}
