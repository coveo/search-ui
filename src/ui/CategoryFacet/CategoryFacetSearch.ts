import { CategoryFacet } from './CategoryFacet';
import { FacetSearchElement } from '../Facet/FacetSearchElement';
import { pluck, debounce, last } from 'underscore';
import { $$, Dom } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { l } from '../../strings/Strings';
import { IGroupByValue } from '../../rest/GroupByValue';
import 'styling/_CategoryFacetSearch';
import { StringUtils } from '../../utils/StringUtils';
import { analyticsActionCauseList, IAnalyticsCategoryFacetMeta } from '../Analytics/AnalyticsActionListMeta';
import { IFacetSearch } from '../Facet/IFacetSearch';
import { IIndexFieldValue } from '../../rest/FieldValue';
import { AccessibleButton } from '../../utils/AccessibleButton';
import * as Globalize from 'globalize';

export class CategoryFacetSearch implements IFacetSearch {
  public container: Dom | undefined;
  public facetSearchElement: FacetSearchElement;
  public displayNewValues: () => void;
  public currentlyDisplayedResults: string[];
  public moreValuesToFetch = true;
  public facetSearchPromise: Promise<IIndexFieldValue[]>;

  private numberOfValuesToFetch: number;

  constructor(private categoryFacet: CategoryFacet) {
    this.facetSearchElement = new FacetSearchElement(this);
    this.displayNewValues = debounce(this.getDisplayNewValuesFunction(), this.categoryFacet.options.facetSearchDelay);
    this.categoryFacet.root.addEventListener('click', (e: MouseEvent) => this.handleClickElsewhere(e));
    this.numberOfValuesToFetch = this.categoryFacet.options.numberOfResultsInFacetSearch;
  }

  public get facetType() {
    return CategoryFacet.ID;
  }

  public build() {
    this.container = $$('div', {
      className: 'coveo-category-facet-search-container',
      role: 'heading',
      'aria-level': 3
    });

    new AccessibleButton()
      .withElement(this.container)
      .withSelectAction(() => {
        $$(this.categoryFacet.element).addClass('coveo-category-facet-searching');
        this.focus();
      })
      .withLabel(l('Search'))
      .build();

    const search = this.facetSearchElement.build();
    const searchPlaceholder = this.buildfacetSearchPlaceholder();
    this.container.append(search);
    this.container.append(searchPlaceholder.el);
    return this.container;
  }

  public focus() {
    this.facetSearchElement.focus();
  }

  public clear() {
    this.dismissSearchResults();
    this.container && this.container.detach();
  }

  public dismissSearchResults() {
    this.removeNoResultsCssClasses();
    $$(this.categoryFacet.element).removeClass('coveo-category-facet-searching');
    $$(this.facetSearchElement.searchResults).empty();
    this.facetSearchElement.clearSearchInput();
    this.facetSearchElement.hideSearchResultsElement();
    this.currentlyDisplayedResults = null;
    this.numberOfValuesToFetch = this.categoryFacet.options.numberOfResultsInFacetSearch;
    this.moreValuesToFetch = true;
  }

  public keyboardEventDefaultHandler() {
    this.moreValuesToFetch = true;
    this.displayNewValues();
  }

  public keyboardNavigationEnterPressed() {
    this.selectCurrentResult();
  }

  public fetchMoreValues() {
    this.numberOfValuesToFetch += this.categoryFacet.options.numberOfResultsInFacetSearch;
    this.displayNewValues();
  }

  public getCaptions() {
    const searchResults = $$(this.facetSearchElement.searchResults);
    const captions = searchResults
      .findAll('.coveo-category-facet-search-value-caption')
      .concat(searchResults.findAll('.coveo-category-facet-search-path-parents'))
      .concat(searchResults.findAll('.coveo-category-facet-search-path-last-value'));
    return captions;
  }

  public updateAriaLive(text: string) {
    this.categoryFacet.searchInterface.ariaLive.updateText(text);
  }

  private selectCurrentResult() {
    if (this.facetSearchElement.currentResult) {
      const currentResultPathData = this.facetSearchElement.currentResult.el.dataset.path;
      const delimiter = this.categoryFacet.options.delimitingCharacter;
      const path = currentResultPathData.split(delimiter);
      this.categoryFacet.changeActivePath(path);
      this.categoryFacet.logAnalyticsEvent(analyticsActionCauseList.categoryFacetSelect, path);
      this.categoryFacet.executeQuery();
      this.categoryFacet.scrollToTop();
    }
  }

  private handleClickElsewhere(e: MouseEvent) {
    const closestContainer = $$(<HTMLElement>e.target).closest('.coveo-category-facet-search-container');

    const isSelfContainer = this.container && closestContainer === this.container.el;
    if (!closestContainer || !isSelfContainer) {
      this.dismissSearchResults();
    }
  }

  private buildfacetSearchPlaceholder() {
    const placeholder = $$('div', { className: 'coveo-category-facet-search-placeholder' });

    const icon = $$('div', { className: 'coveo-category-facet-search-icon' }, SVGIcons.icons.checkboxHookExclusionMore);
    SVGDom.addClassToSVGInContainer(icon.el, 'coveo-category-facet-search-icon-svg');

    const label = $$('span', { className: 'coveo-category-facet-search-label' }, l('Search'));

    placeholder.append(icon.el);
    placeholder.append(label.el);
    return placeholder;
  }

  private getDisplayNewValuesFunction() {
    return async () => {
      this.facetSearchElement.showFacetSearchWaitingAnimation();
      this.categoryFacet.logger.info('Triggering new Category Facet search');
      const categoryFacetValues = await this.categoryFacet.categoryFacetQueryController.searchFacetValues(
        this.facetSearchElement.input.value,
        this.numberOfValuesToFetch
      );
      this.logAnalyticsEvent();
      if (categoryFacetValues.length < this.numberOfValuesToFetch) {
        this.moreValuesToFetch = false;
      }
      if (categoryFacetValues.length == 0) {
        this.noFacetSearchResults();
        return;
      }
      this.removeNoResultsCssClasses();
      this.setFacetSearchResults(categoryFacetValues);

      if (this.shouldPositionSearchResults) {
        this.facetSearchElement.positionSearchResults(
          this.categoryFacet.root,
          this.categoryFacet.element.clientWidth,
          this.facetSearchElement.search
        );
      }

      this.facetSearchElement.hideFacetSearchWaitingAnimation();
    };
  }

  private setFacetSearchResults(categoryFacetValues: IGroupByValue[]) {
    $$(this.facetSearchElement.searchResults).empty();
    this.currentlyDisplayedResults = pluck(categoryFacetValues, 'value');
    for (let i = 0; i < categoryFacetValues.length; i++) {
      const searchResult = this.buildFacetSearchValue(categoryFacetValues[i], i);
      if (i == 0) {
        this.facetSearchElement.setAsCurrentResult(searchResult);
      }
      this.facetSearchElement.appendToSearchResults(searchResult.el);
    }
    this.highlightCurrentQueryWithinSearchResults();
  }

  private getFormattedCount(count: number) {
    return Globalize.format(count, 'n0');
  }

  private buildFacetSearchValue(categoryFacetValue: IGroupByValue, index: number) {
    const path = categoryFacetValue.value.split(this.categoryFacet.options.delimitingCharacter);

    const pathParents = path.slice(0, -1).length != 0 ? `${path.slice(0, -1).join('/')}/` : '';

    const value = $$('span', { className: 'coveo-category-facet-search-value-caption' }, last(path));
    const number = $$(
      'span',
      { className: 'coveo-category-facet-search-value-number' },
      this.getFormattedCount(categoryFacetValue.numberOfResults)
    );
    const pathParentsCaption = $$('span', { className: 'coveo-category-facet-search-path-parents' }, pathParents);

    const pathToValueCaption = $$('span', { className: 'coveo-category-facet-search-path' }, pathParentsCaption);

    const firstRow = $$('div', { className: 'coveo-category-facet-search-first-row' }, value, number);
    const secondRow = $$('div', { className: 'coveo-category-facet-search-second-row' }, pathToValueCaption);
    const item = $$(
      'li',
      {
        id: `coveo-category-facet-search-suggestion-${index}`,
        role: 'option',
        ariaSelected: 'false',
        className: 'coveo-category-facet-search-value',
        title: path
      },
      firstRow,
      secondRow
    );
    item.el.dataset.path = categoryFacetValue.value;

    const countLabel = l('ResultCount', this.getFormattedCount(categoryFacetValue.numberOfResults));
    const label = l('SelectValueWithResultCount', last(path), countLabel);

    new AccessibleButton()
      .withElement(item)
      .withSelectAction(() => {
        this.categoryFacet.changeActivePath(path);
        this.categoryFacet.scrollToTop();
        this.categoryFacet.logAnalyticsEvent(analyticsActionCauseList.categoryFacetSelect, path);
        this.categoryFacet.executeQuery();
      })
      .withLabel(label)
      .build();

    return item;
  }

  private noFacetSearchResults() {
    this.facetSearchElement.hideFacetSearchWaitingAnimation();
    this.facetSearchElement.hideSearchResultsElement();
    $$(this.facetSearchElement.search).addClass('coveo-facet-search-no-results');
    $$(this.categoryFacet.element).addClass('coveo-no-results');
  }

  private removeNoResultsCssClasses() {
    this.facetSearchElement.search && $$(this.facetSearchElement.search).removeClass('coveo-facet-search-no-results');
    $$(this.categoryFacet.element).removeClass('coveo-no-results');
  }

  private highlightCurrentQueryWithinSearchResults() {
    const regex = new RegExp(`(${StringUtils.stringToRegex(this.facetSearchElement.input.value, true)})`, 'ig');
    this.facetSearchElement.highlightCurrentQueryInSearchResults(regex);
  }

  private logAnalyticsEvent() {
    this.categoryFacet.usageAnalytics.logCustomEvent<IAnalyticsCategoryFacetMeta>(
      analyticsActionCauseList.categoryFacetSearch,
      {
        categoryFacetId: this.categoryFacet.options.id,
        categoryFacetField: this.categoryFacet.options.field.toString(),
        categoryFacetTitle: this.categoryFacet.options.title
      },
      this.categoryFacet.root
    );
  }

  private get shouldPositionSearchResults() {
    const searchResults = this.facetSearchElement.searchResults;
    return searchResults && !searchResults.parentElement;
  }
}
